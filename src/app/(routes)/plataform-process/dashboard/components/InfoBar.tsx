"use client";

import React from "react";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";

const InfoBar: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const usuario = auth?.data?.usuario;

  return (
    <div className="w-full bg-white border border-app-gray-1-200 rounded-lg px-6 py-3 flex flex-wrap items-center gap-x-12 gap-y-2 text-sm text-app-gray-2-600 shadow-sm mt-auto mb-6">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-app-gray-2-900">Sesión activa</span>
        <span className="opacity-70">· expira en 58 min</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-bold text-app-gray-2-900 uppercase text-[12px]">Planta:</span>
        <span className="opacity-80">Planta Central</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-bold text-app-gray-2-900 uppercase text-[12px]">Depto:</span>
        <span className="opacity-80">{usuario?.tipoUsuario?.nombre || "Recursos Humanos"}</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="font-bold text-app-gray-2-900 uppercase text-[12px]">Rol:</span>
        <span className="opacity-80">{usuario?.roles?.[0]?.nombre || "Jefe de área"}</span>
      </div>
    </div>
  );
};

export default InfoBar;
