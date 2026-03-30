"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/gcm-plataform/components/ui/Navbar";
import InputGeneric from "@/gcm-plataform/components/ui/InputGeneric";
import ButtonGeneric from "@/gcm-plataform/components/ui/ButtonGeneric";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";
import { usePasswordStrength } from "@/gcm-plataform/components/hooks/usePasswordStrength";
import { updateUserPassword } from "../api/services/password.services";
import { Check, AlertCircle, CheckCircle2 } from "lucide-react";

const PasswordSection: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const usuario = useAuthStore((state) => state.auth?.data?.usuario);
  const completePasswordChange = useAuthStore((state) => state.completePasswordChange);
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { strength, rules } = usePasswordStrength(formData.newPassword);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Eliminamos cualquier espacio en blanco (inicio, medio o fin) usando regex
    const cleanValue = value.replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.id) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserPassword({
        user_id: parseInt(usuario.id),
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        changed_by: parseInt(usuario.id),
      });

      completePasswordChange();
      setSuccess("Contraseña actualizada correctamente. Redirigiendo...");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Redirigimos al dashboard después de un momento
      setTimeout(() => {
        router.replace("/plataform-process/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña");
    } finally {
      setIsLoading(false);
    }
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-1 duration-300">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}
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
              isLoading={isLoading}
              disabled={strength.score < 3 || formData.newPassword !== formData.confirmPassword || !formData.currentPassword || isLoading}
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
