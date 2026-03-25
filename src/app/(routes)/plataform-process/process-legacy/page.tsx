"use client";

import React, { useRef } from "react";
import Navbar from "@/gcm-plataform/components/ui/Navbar";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";

export default function ProcessLegacyPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const auth = useAuthStore((state) => state.auth);
  const token = auth?.data?.tokens?.access_token;
  
  // URL limpia del sistema legado
  const legacyBaseUrl = "http://localhost:3000/sso";

  /**
   * Handshake: Esperamos a que el sistema B nos diga que está listo.
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validar origen del mensaje (Sistema B)
      if (event.origin !== "http://localhost:3000") return;

      if (event.data?.type === "SSO_READY" && token) {
        console.log("[ProcessLegacy] System B is ready, sending token...");
        iframeRef.current?.contentWindow?.postMessage(
          { type: "GCM_AUTH_TOKEN", token: token },
          "http://localhost:3000"
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [token]);

  /**
   * Fallback: Cuando el iframe termina de cargar, intentamos enviar (por si el mensaje de READY llegó muy rápido).
   */
  const handleIframeLoad = () => {
    if (iframeRef.current && token) {
      console.log("[ProcessLegacy] Iframe loaded fallback...");
      iframeRef.current.contentWindow?.postMessage(
        { type: "GCM_AUTH_TOKEN", token: token },
        "http://localhost:3000"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 w-full bg-white relative">
        <iframe 
          ref={iframeRef}
          src={legacyBaseUrl} 
          className="w-full h-full absolute inset-0 border-0"
          title="Legacy Process System"
          onLoad={handleIframeLoad}
        />
      </main>
    </div>
  );
}
