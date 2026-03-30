"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import Logo from "@/gcm-plataform/components/ui/Logo";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  
  // Leemos directamente del store para evitar el desfase de sincronización del AuthContext
  const auth = useAuthStore((state) => state.auth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const pathname = usePathname();
  const mustChangePassword = auth?.data?.must_change_password;

  useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        router.push("/plataform-process/Auth/Login");
      } else if (mustChangePassword && pathname !== "/plataform-process/password") {
        router.push("/plataform-process/password");
      }
    }
  }, [hasHydrated, isAuthenticated, mustChangePassword, pathname, router]);

  // Mientras se hidrata el store (lee de sessionStorage) o si no está autenticado
  if (!hasHydrated) {
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
