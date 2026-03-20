"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/gcm-plataform/components/ui/Logo";
import ButtonGeneric from "@/gcm-plataform/components/ui/ButtonGeneric";
import InputGeneric from "@/gcm-plataform/components/ui/InputGeneric";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { persistUser } from "../api/types/auth.types";

const LoginSection = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Credenciales de prueba
    const TEST_USER = "admin@gcm.com";
    const TEST_PASS = "admin123";

    if (formData.username === TEST_USER && formData.password === TEST_PASS) {
      // Mock de respuesta exitosa basada en persistUser
      const mockAuthData: persistUser = {
        success: true,
        message: "¡Bienvenido de nuevo!",
        data: {
          usuario: {
            id: "mock-id-123",
            email: TEST_USER,
            nombreCompleto: "Administrador GCM",
            tipoUsuario: { id: "1", codigo: "ADMIN", nombre: "Administrador" },
            roles: [{ id: 1, codigo: "ROLE_ADMIN", nombre: "Administrador del Sistema" }],
            estaActivo: "1",
            emailVerificado: true,
            requiereDobleFactorAuth: "0",
          },
          tokens: {
            access_token: "mock-jwt-token-access",
            refresh_token: "mock-jwt-token-refresh",
          },
          sesion: {
            id: "mock-session-id",
            sessionIdString: "session-unique-string-123",
            fechaInicio: new Date().toISOString(),
          },
        },
      };

      setAuth(mockAuthData);
      router.push("/plataform-process/dashboard");
    } else {
      setIsLoading(false);
      if (formData.username !== TEST_USER) {
        setError("El usuario no existe");
      } else {
        setError("Contraseña errónea");
      }
    }
  };

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
            error={error && formData.username !== "admin@gcm.com" ? error : undefined}
          />
          <InputGeneric
            label="Contraseña"
            placeholder="••••••••••"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            error={error && formData.username === "admin@gcm.com" ? error : undefined}
          />
          
          {error && formData.username === "admin@gcm.com" && formData.password === "admin123" && (
             <p className="text-xs text-alert-error-text text-center">{error}</p>
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
