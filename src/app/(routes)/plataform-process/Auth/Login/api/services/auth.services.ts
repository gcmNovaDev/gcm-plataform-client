import apiService from "@/core/http/request-apis.service";
import { AuthType } from "@/core/http/http-client.service";
import { LoginRequest, LoginResponse, persistUser } from "../types/auth.types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Realiza el inicio de sesión del usuario.
 * @param credentials Credenciales de inicio de sesión
 * @returns Datos mapeados para la sesión y bandera de cambio obligatorio de contraseña
 */
export const login = async (
  credentials: LoginRequest,
): Promise<{ mappedAuth: persistUser; mustChangePassword: boolean }> => {
  try {
    const response = await apiService.post<LoginResponse>(
      `${baseURL}auth/login/`,
      credentials,
      AuthType.BasicAuthentication,
    );

    if (!response.success || !response.data) {
      const error: any = new Error(
        response.message || "Error al iniciar sesión",
      );
      error.data = response.data;
      throw error;
    }

    const data = response.data;

    // Mapping flat response to nested structure expected by authStore.ts
    const mappedAuth: persistUser = {
      success: true,
      message: response.message || "Login exitoso",
      data: {
        usuario: {
          id: data.user_id.toString(),
          email: data.email ?? "",
          nombreCompleto:
            `${data.first_name || ""} ${data.second_name || ""} ${data.first_last_name || ""} ${data.second_last_name || ""}`.trim() ||
            data.username ||
            "",
          tipoUsuario: {
            id: data.plant_id?.toString() || "0",
            codigo: "PLANT",
            nombre: "Planta",
          },
          roles: [],
          estaActivo: "1",
          emailVerificado: true,
          requiereDobleFactorAuth: "0",
        },
        tokens: {
          access_token: data.token || data.tokens || "",
          refresh_token: data.refresh_token ?? undefined,
        },
        sesion: {
          id: (data.session_id ?? 0).toString(),
          sessionIdString: (data.session_id ?? 0).toString(),
        },
      },
    };

    return {
      mappedAuth,
      mustChangePassword: data.must_change_password ?? false,
    };
  } catch (error: any) {
    throw error;
  }
};
