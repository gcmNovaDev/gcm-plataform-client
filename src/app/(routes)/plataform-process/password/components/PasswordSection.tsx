"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/gcm-plataform/components/ui/Navbar";
import InputGeneric from "@/gcm-plataform/components/ui/InputGeneric";
import ButtonGeneric from "@/gcm-plataform/components/ui/ButtonGeneric";
import { Check } from "lucide-react";

const PasswordSection: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [strength, setStrength] = useState({
    score: 0,
    label: "Muy débil",
    color: "bg-red-500",
  });

  const [rules, setRules] = useState({
    minLength: false,
    hasUpper: false,
    hasNumber: false,
  });

  useEffect(() => {
    const pwd = formData.newPassword;
    const newRules = {
      minLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
    };
    setRules(newRules);

    const score = Object.values(newRules).filter(Boolean).length;
    let label = "Muy débil";
    let color = "bg-red-500";
    
    if (score === 1) { label = "Débil"; color = "bg-orange-500"; }
    else if (score === 2) { label = "Buena"; color = "bg-emerald-500"; }
    else if (score === 3) { label = "Muy segura"; color = "bg-blue-500"; }

    setStrength({ score, label, color });
  }, [formData.newPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar showBack />

      <main className="flex-1 flex flex-col p-6 sm:p-10 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-app-gray-2-900">Cambiar contraseña</h1>
          <p className="text-app-gray-1-500 mt-1">
            Tu nueva contraseña debe ser diferente a las últimas 5 utilizadas
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-app-gray-1-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-app-gray-2-900 leading-none">Nueva contraseña</h2>
            <p className="text-sm text-app-gray-1-500 mt-1">
              Elige una contraseña segura para tu cuenta
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <InputGeneric
              label="Contraseña actual"
              name="currentPassword"
              type="password"
              placeholder="••••••••••"
              value={formData.currentPassword}
              onChange={handleInputChange}
            />

            <div className="space-y-4">
              <InputGeneric
                label="Nueva contraseña"
                name="newPassword"
                type="password"
                placeholder="••••••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
              />

              {/* Strength Meter */}
              {formData.newPassword && (
                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${strength.color}`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs font-semibold ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </p>

                  {/* Rules Checklist */}
                  <ul className="space-y-1.5">
                    <li className={`flex items-center gap-2 text-xs font-medium transition-colors ${rules.minLength ? 'text-emerald-600' : 'text-app-gray-1-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${rules.minLength ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      Mínimo 8 caracteres
                    </li>
                    <li className={`flex items-center gap-2 text-xs font-medium transition-colors ${rules.hasUpper ? 'text-emerald-600' : 'text-app-gray-1-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${rules.hasUpper ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      Al menos una mayúscula
                    </li>
                    <li className={`flex items-center gap-2 text-xs font-medium transition-colors ${rules.hasNumber ? 'text-emerald-600' : 'text-app-gray-1-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${rules.hasNumber ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      Al menos un número
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <InputGeneric
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              placeholder="••••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={formData.confirmPassword && formData.confirmPassword !== formData.newPassword ? "Las contraseñas no coinciden" : undefined}
            />

            <ButtonGeneric 
              type="submit" 
              className="w-full !mt-10"
              variant="primary"
              disabled={strength.score < 3 || formData.newPassword !== formData.confirmPassword || !formData.currentPassword}
            >
              Actualizar contraseña
            </ButtonGeneric>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PasswordSection;
