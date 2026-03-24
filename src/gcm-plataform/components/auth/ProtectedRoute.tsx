"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import Logo from "@/gcm-plataform/components/ui/Logo";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuth();

  useEffect(() => {
    console.log("[ProtectedRoute] State changed:", { hasHydrated, isAuthenticated });
    if (hasHydrated && !isAuthenticated) {
      console.warn("[ProtectedRoute] Not authenticated, redirecting to Login...");
      router.push("/plataform-process/Auth/Login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Mientras se hidrata el store (lee de sessionStorage) o si no está autenticado
  if (!hasHydrated) {
    console.log("[ProtectedRoute] Waiting for hydration...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Logo width={48} height={48} className="animate-pulse" />
          <p className="text-app-gray-1-500 text-sm font-medium animate-pulse">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect se encargará del redireccionamiento
  }

  return <>{children}</>;
};

export default ProtectedRoute;
