/**
 * Extrae las iniciales de un nombre completo.
 * Si el nombre no existe, devuelve "U".
 */
export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
