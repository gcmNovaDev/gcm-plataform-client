"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./ProtectedRoute";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();

  // Definición de rutas privadas
  // Protegemos dashboard y password


  const PUBLIC_ROUTES = [
    "/plataform-process/Auth/Login",
  ];
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!isPublic) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  return <>{children}</>;
};

export default RouteGuard;
