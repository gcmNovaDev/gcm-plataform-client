import apiService from "@/core/http/request-apis.service";
import { AuthType } from "@/core/http/http-client.service";
import { SystemsResponse } from "../types/system.types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Obtiene la lista de sistemas disponibles para un usuario específico.
 * @param userId ID del usuario
 * @returns Promesa con la respuesta del backend conteniendo los sistemas
 */
export const getUserSystems = async (
  userId: string | number,
): Promise<SystemsResponse> => {
  try {
    const data = await apiService.get<SystemsResponse>(
      `${baseURL}users/${userId}/systems`,
      AuthType.SecurityAuthentication,
      { cache: "no-store" } as any,
    );
    return data;
  } catch (error: any) {
    throw error;
  }
};
