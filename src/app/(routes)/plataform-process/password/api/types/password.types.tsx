
export interface ChangePasswordRequest {
  user_id: number;
  current_password: string;
  new_password: string;
  changed_by: number;
}