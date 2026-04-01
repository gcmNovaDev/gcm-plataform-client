"use client";

import React from "react";
import Navbar from "@/gcm-plataform/components/ui/Navbar";
import SystemCard from "./SystemCard";
import InfoBar from "./InfoBar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { Sistema } from "../../Auth/Login/api/types/auth.types";
import { generateSSOToken } from "../../Auth/SSO/api/services/sso.services";
import { getUserSystems } from "../system/api/services/system.services";
import { BackendSystem } from "../system/api/types/system.types";

const systemIconMap: Record<string, string> = {
  "PROCESS": "Layout",
  "PROCESS-IAM": "Settings",
  "INVENTARIO": "Layers",
  "PLANILLAS": "Users",
  "ENFERMERÍA": "Activity",
  "ADMINISTRACIÓN": "Settings",
};

const DashboardSection: React.FC = () => {
  const router = useRouter();
  const { auth, setSsoToken } = useAuthStore();
  const [sistemas, setSistemas] = React.useState<Sistema[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const usuario = auth?.data?.usuario;
  const firstName = usuario?.nombreCompleto?.split(" ")[0] || "Usuario";

  React.useEffect(() => {
    const fetchSystems = async () => {
      if (!usuario?.id) return;
      
      try {
        setIsLoading(true);
        const response = await getUserSystems(usuario.id);
        
        if (response.success && response.data?.systems) {
          const mappedSystems: Sistema[] = response.data.systems
            .filter((s: BackendSystem) => s.system_name.toLowerCase() !== "process-plataform")
            .map((s: BackendSystem) => {
            // Todos los sistemas usan ahora el componente genérico de iframe
            const genericRoute = "/plataform-process/process-legacy";
            return {
              id: s.system_id,
              nombre: s.system_name,
              descripcion: s.description,
              icono: systemIconMap[s.system_name.toUpperCase()] || "Layers",
              // Guardamos la URL real para el iframe pero navegamos a la ruta limpia
              url_real: s.url,
              url: genericRoute,
            };
          });
          setSistemas(mappedSystems);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, [usuario?.id]);

  const handleSystemClick = async (sistema: Sistema) => {
    if (!sistema.url_real) {
      return;
    }

    try {
      // 1. Limpiar el token anterior para asegurar frescura
      setSsoToken("");
      
      // 2. Guardar el sistema seleccionado en localStorage para mantener la URL del navegador limpia
      if (typeof window !== "undefined") {
        localStorage.setItem("gcm_selected_system_url", sistema.url_real);
        localStorage.setItem("gcm_selected_system_name", sistema.nombre);
      }

      // 3. Generar token SSO nuevo localmente a través de Server Action
      if (!usuario) throw new Error("Usuario no autenticado");

      const tokenSso = await generateSSOToken({
        user_id: usuario.id,
        username: usuario.nombreCompleto?.split(" ")[0] || "User",
        email: usuario.email,
        refresh_token: auth?.data?.tokens?.refresh_token!,
        system_id: sistema.id,
      });
      
      // 4. Guardar y navegar a la ruta limpia
      setSsoToken(tokenSso);
      router.push(sistema.url || "/plataform-process/process-legacy");
    } catch (error) {
      console.error("No se pudo iniciar sesión en el sistema solicitado. Por favor intente de nuevo: ", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 flex flex-col p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Header Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-app-gray-2-900">
            Bienvenido, <span className="text-primary-700">{firstName}</span>
          </h1>
          <p className="text-app-gray-1-500 mt-1">
            Selecciona un sistema para continuar
          </p>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            // Skeleton loader or loading state
            <div className="col-span-full text-center py-20">
              <p className="text-app-gray-1-500 animate-pulse">Cargando sistemas...</p>
            </div>
          ) : sistemas.length > 0 ? (
            sistemas.map((sistema) => (
              <SystemCard
                key={sistema.id}
                nombre={sistema.nombre}
                descripcion={sistema.descripcion}
                icono={sistema.icono}
                esProximamente={sistema.esProximamente}
                onClick={() => handleSystemClick(sistema)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-app-gray-1-500">No tienes sistemas asignados.</p>
            </div>
          )}
        </div>

        {/* Footer Info Bar */}
        <InfoBar />
      </main>
    </div>
  );
};

export default DashboardSection;
