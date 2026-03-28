export interface BackendSystem {
  system_id: number;
  system_name: string;
  url: string;
  description: string;
}

export interface SystemsResponse {
  success: boolean;
  message: string;
  data: {
    result_code: number;
    result_message: string;
    systems: BackendSystem[];
  };
}
