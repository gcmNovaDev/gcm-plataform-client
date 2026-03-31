import apiService from "@/core/http/request-apis.service";
import { AuthType } from "@/core/http/http-client.service";
import { UserProfileResponse } from "../types/users.types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Obtiene el perfil completo de un usuario por su ID
 * @param userId ID del usuario
 * @returns Promesa con los datos del usuario incluyendo el nombre del departamento
 */
export const getUserProfile = async (
  userId: string | number,
): Promise<UserProfileResponse> => {
  try {
    const data = await apiService.get<UserProfileResponse>(
      `${baseURL}users/${userId}`,
      AuthType.SecurityAuthentication,
      { cache: "no-store" } as any,
    );
    return data;
  } catch (error: any) {
    throw error;
  }
};
