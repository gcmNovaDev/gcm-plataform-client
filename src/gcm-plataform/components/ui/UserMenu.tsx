"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Key, ArrowLeft } from "lucide-react";
import { useNavbarAuth } from "@/gcm-plataform/hooks/useNavbarAuth";
import { getInitials } from "@/gcm-plataform/utils/user";

interface UserMenuProps {
  showBack?: boolean;
  onBack?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ showBack = false, onBack }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { usuario, sesion, handleLogout } = useNavbarAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-3 py-1.5 rounded-md hover:bg-white/10 transition-all text-white border border-transparent"
      >
        {/* User Info (Desktop) */}
        <div className="hidden sm:flex flex-col items-end leading-tight text-right">
          <span className="font-bold text-sm tracking-tight text-white">
            {usuario?.nombreCompleto || "Usuario"}
          </span>
          <span className="text-[10px] opacity-70 uppercase font-medium text-white/80">
            {usuario?.tipoUsuario?.nombre || "Planta Central"}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm border-2 border-primary-800 shadow-inner">
          {getInitials(usuario?.nombreCompleto)}
        </div>

        <ChevronDown
          size={14}
          className={`opacity-70 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border border-app-gray-1-300 py-1 z-20 origin-top-right">
            {/* Session Header */}
            <div className="px-4 py-2 bg-slate-50 border-b border-app-gray-1-200 mb-1">
              <p className="text-[10px] font-bold text-app-gray-1-400 uppercase tracking-widest">
                Sesión Activa
              </p>
              <p className="text-[10px] font-mono text-app-gray-1-600 truncate mt-0.5">
                {sesion?.sessionIdString || "ID-MOCK-SESSION-123"}
              </p>
            </div>

            {/* Actions */}
            <div className="px-1 space-y-0.5">
              {showBack ? (
                <button
                  onClick={handleBack}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-app-gray-2-800 hover:bg-primary-50 rounded transition-colors"
                >
                  <ArrowLeft size={16} className="text-app-gray-1-500" />
                  Regresar
                </button>
              ) : (
                <button
                  onClick={() => router.push("/plataform-process/password")}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-app-gray-2-800 hover:bg-primary-50 rounded transition-colors"
                >
                  <Key size={16} className="text-app-gray-1-500" />
                  Cambiar clave
                </button>
              )}

              <div className="h-px bg-app-gray-1-200 my-1 mx-2" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors font-medium border-t border-transparent"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
