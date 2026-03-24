"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { persistUser } from "@/app/(routes)/plataform-process/Auth/Login/api/types/auth.types";

interface AuthContextType {
  auth: persistUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado en memoria (useState) según requisito
  const [auth, setAuth] = useState<persistUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Obtenemos el estado del store persistente (sessionStorage)
  const storeAuth = useAuthStore((state) => state.auth);
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Sincronizamos el estado de memoria con el store persistente
  useEffect(() => {
    if (hasHydrated) {
      setAuth(storeAuth);
      setIsAuthenticated(storeIsAuthenticated);
    }
  }, [hasHydrated, storeAuth, storeIsAuthenticated]);

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, hasHydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
