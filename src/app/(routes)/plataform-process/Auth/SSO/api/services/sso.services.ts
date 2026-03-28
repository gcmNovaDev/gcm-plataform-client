import { generateLocalSSOTokenAction } from "../actions/generarJWT";

/**
 * Genera un token SSO localmente.
 * @param payload Datos del usuario para el token
 * @returns Promesa con el token SSO generado
 */
export const generateSSOToken = async (payload: {
  user_id: string | number;
  username: string;
  email: string;
  refresh_token: string;
  system_id: string | number;
}): Promise<string> => {
  try {
    const tokenSso = await generateLocalSSOTokenAction(payload);
    return tokenSso;
  } catch (error) {
    console.error("Error al generar token SSO localmente:", error);
    throw new Error("No se pudo generar el token de acceso.");
  }
};
