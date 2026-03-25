"use client";

import React, { useRef } from "react";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";

export default function ProcessLegacyPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const auth = useAuthStore((state) => state.auth);
  const token = auth?.data?.tokens?.access_token;
  
  // URL base del sistema legado — configurada en .env.local
  const legacyOrigin = process.env.NEXT_PUBLIC_LEGACY_SYSTEM_URL || "http://localhost:3000";
  const legacyBaseUrl = `${legacyOrigin}/sso`;

  /**
   * Handshake: Esperamos a que el sistema B nos diga que está listo.
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validar origen del mensaje (Sistema B)
      if (event.origin !== legacyOrigin) return;

      if (event.data?.type === "SSO_READY" && token) {
        console.log("[ProcessLegacy] System B is ready, sending token...");
        iframeRef.current?.contentWindow?.postMessage(
          { type: "GCM_AUTH_TOKEN", token: token },
          legacyOrigin
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [token, legacyOrigin]);

  /**
   * Fallback: Cuando el iframe termina de cargar, intentamos enviar (por si el mensaje de READY llegó muy rápido).
   */
  const handleIframeLoad = () => {
    if (iframeRef.current && token) {
      console.log("[ProcessLegacy] Iframe loaded fallback...");
      iframeRef.current.contentWindow?.postMessage(
        { type: "GCM_AUTH_TOKEN", token: token },
        legacyOrigin
      );
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <iframe 
        ref={iframeRef}
        src={legacyBaseUrl} 
        className="w-full h-full border-0"
        title="Legacy Process System"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
