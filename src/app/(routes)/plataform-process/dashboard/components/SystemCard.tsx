"use client";

import React from "react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SystemCardProps {
  nombre: string;
  descripcion: string;
  icono?: string;
  onClick?: () => void;
  esProximamente?: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({
  nombre,
  descripcion,
  icono,
  onClick,
  esProximamente = false,
}) => {
  // Dinámicamente obtener el icono de lucide
  const IconComponent = icono && (Icons as any)[icono] ? (Icons as any)[icono] as LucideIcon : Icons.HelpCircle;

  if (esProximamente) {
    return (
      <div className="bg-app-gray-1-50/50 border border-dashed border-app-gray-1-300 rounded-2xl p-8 flex flex-col items-center justify-center transition-all opacity-60 grayscale cursor-not-allowed">
        <div className="w-16 h-16 rounded-xl bg-app-gray-1-100 flex items-center justify-center mb-4 text-app-gray-1-400">
          <Icons.PlusCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-app-gray-2-400">{nombre}</h3>
        <p className="text-sm text-app-gray-1-400 text-center">{descripcion}</p>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-app-gray-1-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group active:scale-95"
    >
      <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-100 transition-colors">
        <IconComponent size={32} />
      </div>
      <h3 className="text-lg font-bold text-app-gray-2-900 group-hover:text-primary-700 transition-colors">
        {nombre}
      </h3>
      <p className="text-sm text-app-gray-1-500 text-center uppercase tracking-tighter opacity-80 mt-1">
        {descripcion}
      </p>
    </div>
  );
};

export default SystemCard;
