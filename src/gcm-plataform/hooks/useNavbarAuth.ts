"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { useRouter } from "next/navigation";

/**
 * Hook personalizado para manejar el estado de autenticación y logout en el Navbar.
 */
export const useNavbarAuth = () => {
  const auth = useAuthStore((state) => state.auth);
  const logout = useAuthStore((state) => state.logout);
  const userProfile = useAuthStore((state) => state.userProfile);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const router = useRouter();

  const usuario = auth?.data?.usuario;
  const sesion = auth?.data?.sesion;
  const isAuthenticated = !!auth?.data?.tokens?.access_token;

  useEffect(() => {
    if (usuario?.id) {
      fetchUserProfile(usuario.id);
    }
  }, [usuario?.id, fetchUserProfile]);

  const handleLogout = async () => {
    await logout();
    router.push("/plataform-process/Auth/Login");
  };

  return {
    usuario,
    sesion,
    isAuthenticated,
    handleLogout,
    userProfile,
  };
};
