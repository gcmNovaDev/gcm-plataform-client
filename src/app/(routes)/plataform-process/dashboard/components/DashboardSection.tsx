"use client";

import React from "react";
import Navbar from "@/gcm-plataform/components/ui/Navbar";
import SystemCard from "./SystemCard";
import InfoBar from "./InfoBar";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { Sistema } from "../../Auth/api/types/auth.types";

const mockSistemas: Sistema[] = [
  { id: 1, nombre: "Process", descripcion: "Gestión de flujos", icono: "Layout", url: "http://10.0.0.231:8080/" },
  { id: 2, nombre: "Inventario", descripcion: "Stock y activos", icono: "Layers" },
  { id: 3, nombre: "Planillas", descripcion: "RRHH · nómina", icono: "Users" },
  { id: 4, nombre: "Enfermería", descripcion: "Salud · registros", icono: "Activity" },
  { id: 5, nombre: "Administración", descripcion: "Configuración", icono: "Settings" },
  { id: 6, nombre: "Próximamente", descripcion: "Nuevo sistema", icono: "PlusCircle", esProximamente: true },
];

const DashboardSection: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const usuario = auth?.data?.usuario;
  const firstName = usuario?.nombreCompleto?.split(" ")[0] || "Usuario";

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
          {mockSistemas.map((sistema) => (
            <SystemCard
              key={sistema.id}
              nombre={sistema.nombre}
              descripcion={sistema.descripcion}
              icono={sistema.icono}
              esProximamente={sistema.esProximamente}
              onClick={() => {
                if (sistema.url) {
                  window.location.assign(sistema.url);
                } else if (!sistema.esProximamente) {
                  console.log(`Redirecting to ${sistema.nombre}...`);
                }
              }}
            />
          ))}
        </div>

        {/* Footer Info Bar */}
        <InfoBar />
      </main>
    </div>
  );
};

export default DashboardSection;
