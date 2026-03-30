import apiService from "@/core/http/request-apis.service";
import { AuthType } from "@/core/http/http-client.service";
import { GenericBackendResponse } from "@/app/(routes)/plataform-process/Auth/Login/api/types/auth.types";
import { ChangePasswordRequest } from "../types/password.types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Actualiza la contraseña del usuario.
 * @param payload Datos para el cambio de contraseña
 * @returns Respuesta del backend
 */
export const updateUserPassword = async (
  payload: ChangePasswordRequest,
): Promise<GenericBackendResponse> => {
  try {
    const response = await apiService.post<GenericBackendResponse>(
      `${baseURL}users/changePassword`,
      payload,
      AuthType.SecurityAuthentication,
    );

    if (!response.success) {
      // Lanzamos error para que sea capturado por el componente
      const error: any = new Error(
        response.message || "Error al actualizar la contraseña",
      );
      error.data = response.data;
      throw error;
    }

    return response;
  } catch (error: any) {
    throw error;
  }
};
