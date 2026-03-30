import { useState, useEffect } from "react";

/**
 * Hook personalizado para calcular la fortaleza de una contraseña y validar reglas específicas.
 * @param password La contraseña a evaluar
 * @returns Un objeto con la fortaleza (score, label, color) y el estado de las reglas.
 */
export const usePasswordStrength = (password: string) => {
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
    const newRules = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
    setRules(newRules);

    const score = Object.values(newRules).filter(Boolean).length;
    let label = "Muy débil";
    let color = "bg-red-500";
    
    if (score === 1) { label = "Débil"; color = "bg-orange-500"; }
    else if (score === 2) { label = "Buena"; color = "bg-emerald-500"; }
    else if (score === 3) { label = "Muy segura"; color = "bg-blue-500"; }

    setStrength({ score, label, color });
  }, [password]);

  return { strength, rules };
};
