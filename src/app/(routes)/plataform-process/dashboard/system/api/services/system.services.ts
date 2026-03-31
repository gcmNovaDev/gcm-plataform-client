import apiService from "@/core/http/request-apis.service";
import { AuthType } from "@/core/http/http-client.service";
import { SystemsResponse, UserRoleResponse } from "../types/system.types";

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

/**
 * Obtiene los roles asignados a un usuario logueado en un sistema específico.
 * @param userId ID del usuario
 * @param systemId ID del sistema (Ej. 3 para PROCESS-PLATAFORM)
 * @returns Promesa con la respuesta del backend conteniendo los roles
 */
export const getUserRolesBySystem = async (
  userId: string | number,
  systemId: string | number,
): Promise<UserRoleResponse> => {
  try {
    const data = await apiService.get<UserRoleResponse>(
      `${baseURL}users/${userId}/systems/${systemId}/roles`,
      AuthType.SecurityAuthentication,
      { cache: "no-store" } as any,
    );
    return data;
  } catch (error: any) {
    throw error;
  }
};
