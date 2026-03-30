export interface UserProfileData {
  id: number;
  first_name: string;
  second_name: string;
  first_last_name: string;
  second_last_name: string;
  username: string;
  email: string;
  department_id: number;
  department_name: string;
  plant_id: number;
  is_active: boolean;
  must_change_password: boolean;
  failed_login_attempts: number;
  locked_until: string | null;
  created_at: string;
  last_login: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfileData;
}
