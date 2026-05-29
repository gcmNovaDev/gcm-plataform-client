import apiService from "@/core/http/request-apis.service";
import { AuthType } from "@/core/http/http-client.service";
import {
  UserPermissionsResponse,
  UserRolesResponse,
  UserSidebarResponse,
} from "../types/userAccess.types";

/**
 * Recupera el menú lateral dinámico del usuario para un sistema específico
 */
export async function getUserSidebarMenu(
  user_id: number | string,
  system_id: number | string,
): Promise<UserSidebarResponse> {
  return apiService.get<UserSidebarResponse>(
    `sidebar/user/${user_id}/system/${system_id}`,
    AuthType.SecurityAuthentication,
  );
}

/**
 * Recupera los roles asignados al usuario en un sistema específico
 */
export async function getUserRoles(
  user_id: number | string,
  system_id: number | string,
): Promise<UserRolesResponse> {
  return apiService.get<UserRolesResponse>(
    `users/${user_id}/systems/${system_id}/roles`,
    AuthType.SecurityAuthentication,
  );
}

/**
 * Recupera los permisos específicos del usuario para un sistema específico
 */
export async function getUserPermissions(
  user_id: number | string,
  system_id: number | string,
): Promise<UserPermissionsResponse> {
  return apiService.get<UserPermissionsResponse>(
    `users/${user_id}/systems/${system_id}/permissions`,
    AuthType.SecurityAuthentication,
  );
}
