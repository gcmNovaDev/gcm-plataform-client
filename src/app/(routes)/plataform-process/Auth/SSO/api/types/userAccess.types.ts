export interface UserPermission {
  permission_name: string;
}

export interface UserPermissionsResponse {
  success: boolean;
  message: string;
  data: UserPermission[];
}

export interface UserRole {
  role_id: number;
  role_name: string;
  system_id: number;
  system_name: string;
  granted_at: string;
}

export interface UserRolesResponse {
  success: boolean;
  message: string;
  data: UserRole[];
}

export interface UserSidebarItem {
  id: number;
  parent_id: number | null;
  label: string;
  icon: string;
  route: string | null;
  order_index: number;
  mobile_hidden: boolean;
  desktop_hidden: boolean;
  can_access: number;
}

export interface UserSidebarResponse {
  success: boolean;
  message: string;
  data: UserSidebarItem[];
}

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
