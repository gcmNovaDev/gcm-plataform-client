"use client";

import React, { useRef, Suspense } from "react";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { useSearchParams } from "next/navigation";

function ProcessLegacyContent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const searchParams = useSearchParams();
  const { auth, logout } = useAuthStore();
  const token = auth?.data?.tokens?.token_sso ?? "";
  
  // Priorizamos localStorage para mantener la URL del navegador limpia e intentamos normalizar el origin
  const urlFromParam = searchParams.get("url");
  const nameFromParam = searchParams.get("name");
  
  const rawOrigin = urlFromParam || (typeof window !== "undefined" ? localStorage.getItem("gcm_selected_system_url") : null) || process.env.NEXT_PUBLIC_LEGACY_SYSTEM_URL || "http://localhost:3000";
  const origin = rawOrigin.endsWith("/") ? rawOrigin.slice(0, -1) : rawOrigin;
  const systemName = nameFromParam || (typeof window !== "undefined" ? localStorage.getItem("gcm_selected_system_name") : null) || "Sistema";
  
  const legacyBaseUrl = `${origin}/sso`;

  /**
   * Handshake: Esperamos a que el sistema B nos diga que está listo.
   */
  React.useEffect(() => {   
    const handleMessage = async (event: MessageEvent) => {
      // Validar origen del mensaje (Sistema B)
      if (event.origin !== origin) {
        return;
      }

      // Éxito: Enviar token
      if (event.data?.type === process.env.NEXT_PUBLIC_SSO_EVENT_READY) {
        if (!token) {
          return;
        }

        iframeRef.current?.contentWindow?.postMessage(
          { type: process.env.NEXT_PUBLIC_SSO_EVENT_TOKEN, token: token },
          origin
        );
      }

      // Error: Capturar rechazo desde el iframe y redirigir al login
      if (event.data?.type === process.env.NEXT_PUBLIC_SSO_EVENT_ERROR) { 
        // 1. Cerrar la sesión de la plataforma
        await logout();

        // 2. Redirigir la ventana principal al login
        window.location.href = "/plataform-process/Auth/Login";
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [token, origin, logout]);


  /**
   * Fallback: Cuando el iframe termina de cargar, intentamos enviar (por si el mensaje de READY llegó muy rápido).
   */
  const handleIframeLoad = () => {
    if (iframeRef.current && token && origin) {
      iframeRef.current.contentWindow?.postMessage(
        { type: process.env.NEXT_PUBLIC_SSO_EVENT_TOKEN, token: token },
        origin
      );
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <iframe 
        ref={iframeRef}
        src={legacyBaseUrl} 
        className="w-full h-full border-0"
        title={`Legacy ${systemName} System`}
        onLoad={handleIframeLoad}
      />
    </div>
  );
}

export default function ProcessLegacyPage() {
  const searchParams = useSearchParams();
  const systemName = searchParams.get("name") || (typeof window !== "undefined" ? localStorage.getItem("gcm_selected_system_name") : null) || "Sistema";

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-app-gray-1-500 animate-pulse">Cargando {systemName}...</p>
      </div>
    }>
      <ProcessLegacyContent />
    </Suspense>
  );
}


