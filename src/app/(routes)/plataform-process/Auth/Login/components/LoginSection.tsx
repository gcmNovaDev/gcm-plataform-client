"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/gcm-plataform/components/ui/Logo";
import ButtonGeneric from "@/gcm-plataform/components/ui/ButtonGeneric";
import InputGeneric from "@/gcm-plataform/components/ui/InputGeneric";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { login } from "../api/services/auth.services";

const LoginSection = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/plataform-process/dashboard");
    }
  }, [isAuthenticated, router]);
  
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Eliminamos cualquier espacio en blanco (inicio, medio o fin) usando regex
    const cleanValue = value.replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { mappedAuth, mustChangePassword } = await login({
        identifier: formData.username,
        password: formData.password,
      });

      setAuth(mappedAuth);
      
      if (mustChangePassword) {
        router.replace("/plataform-process/password");
      } else {
        router.replace("/plataform-process/dashboard");
      }
      
    } catch (err: any) {
      // Priorizamos el mensaje del backend si viene en el error de Axios
      let errorMessage = err.response?.data?.message || err.message || "Error al iniciar sesión";
      
      if (errorMessage === "Network Error" || err.message?.includes("Network Error")) {
        errorMessage = "Error de conexión al servidor. Por favor, comunícate con un administrador, de momento no contamos con el servicio.";
      }

      // Extraemos información de intentos fallidos o bloqueo
      const errorData = err.response?.data?.data || err.data;
      if (errorData) {
        const { failed_attempts, is_locked } = errorData;
        
        if (is_locked) {
          const unlockTime = errorData.locked_until
            ? new Date(errorData.locked_until).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC",
              })
            : "";
          errorMessage = `Cuenta bloqueada por seguridad. No puedes iniciar sesión hasta las ${unlockTime || "dentro de un momento"}.`;
        } else if (typeof failed_attempts === "number" && failed_attempts > 0) {
          const suffix = failed_attempts === 1 ? "intento fallido" : "intentos fallidos";
          errorMessage = `${errorMessage} (${failed_attempts} ${suffix})`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Evita el "parpadeo" del login si ya está autenticado o hidratando el estado
  if (!hasHydrated || isAuthenticated) {
    return <div className="min-h-screen bg-primary-50 flex items-center justify-center"></div>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-sm border border-app-gray-1-200 p-8 flex flex-col items-center">
        {/* Logo and Header */}
        <Logo width={64} height={64} className="mb-6" />
        
        <h1 className="text-xl font-bold text-app-gray-2-900 mb-1">
          Portal corporativo
        </h1>
        <p className="text-sm text-app-gray-1-500 mb-8 text-center">
          Ingresa tus credenciales para continuar
        </p>

        {/* Login Form */}
        <form className="w-full space-y-5" onSubmit={handleLogin}>
          <InputGeneric
            label="Usuario"
            placeholder="admin@gcm.com"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            required
            error={error ? "" : undefined}
          />
          <InputGeneric
            label="Contraseña"
            placeholder="••••••••••"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            error={error ? "" : undefined}
          />
          
          {error && (
             <p className="text-xs text-red-500 text-center font-medium bg-red-50 p-2 rounded border border-red-100 italic">{error}</p>
          )}

          <ButtonGeneric 
            type="submit" 
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Ingresar al portal
          </ButtonGeneric>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-app-gray-1-100 w-full text-center">
          <p className="text-[10px] uppercase tracking-wider text-app-gray-1-400 font-medium">
            Red interna — acceso solo desde LAN
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
