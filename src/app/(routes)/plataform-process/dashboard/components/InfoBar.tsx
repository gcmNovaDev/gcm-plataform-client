"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore, parseJwtExp } from "@/gcm-plataform/components/store/authStore";
import { getUserRolesBySystem } from "../system/api/services/system.services";

const InfoBar: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const userProfile = useAuthStore((state) => state.userProfile);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const usuario = auth?.data?.usuario;
  const accessToken = auth?.data?.tokens?.access_token;
  
  const [roleName, setRoleName] = useState<string>("Cargando...");
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateTime = async () => {
      // Llama a la función del store que evalúa y refresca proactivamente el token si está por expirar
      await useAuthStore.getState().getValidAccessToken();

      // Tomamos el token más fresco directamente del estado
      const currentToken = useAuthStore.getState().auth?.data?.tokens?.access_token;
      
      if (!currentToken) {
        setMinutesLeft(null);
        return;
      }
      const exp = parseJwtExp(currentToken);
      if (!exp) {
        setMinutesLeft(null);
        return;
      }
      const now = Math.floor(Date.now() / 1000);
      const diff = Math.max(0, exp - now);
      
      setMinutesLeft(Math.ceil(diff / 60));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, [accessToken]);

  useEffect(() => {
    if (usuario?.id) {
      fetchUserProfile(usuario.id);
    }
  }, [usuario?.id, fetchUserProfile]);

  useEffect(() => {
    const fetchRole = async () => {
      if (!usuario?.id) return;
      try {
        const res = await getUserRolesBySystem(usuario.id, 3);
        if (res.success && res.data && res.data.length > 0) {
          // Tomar el primer rol o concatenarlos
          setRoleName(res.data[0].role_name);
        } else {
          setRoleName("Sin rol asignado");
        }
      } catch (error) {
        // En caso de fallo usar fallback
        setRoleName(usuario?.roles?.[0]?.nombre || "Jefe de área");
      }
    };
    fetchRole();
  }, [usuario?.id, usuario?.roles]);

  return (
    <div className="w-full bg-white border border-app-gray-1-200 rounded-lg px-6 py-3 flex flex-wrap items-center gap-x-12 gap-y-2 text-sm text-app-gray-2-600 shadow-sm mt-auto mb-6">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-app-gray-2-900">Sesión activa</span>
        <span className="opacity-70">
          {minutesLeft !== null ? `· expira en ${minutesLeft} min` : "· expira pronto"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-bold text-app-gray-2-900 uppercase text-[12px]">Depto:</span>
        <span className="opacity-80">
          {userProfile?.department_name || usuario?.tipoUsuario?.nombre || "Cargando..."}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="font-bold text-app-gray-2-900 uppercase text-[12px]">Rol:</span>
        <span className="opacity-80">{roleName}</span>
      </div>
    </div>
  );
};

export default InfoBar;
