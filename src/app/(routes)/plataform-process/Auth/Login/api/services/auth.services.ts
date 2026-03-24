import httpClient from "@/core/http/http-client.service";
import {
  LoginRequest,
  LoginResponse,
  persistUser,
  LoginResponseData,
} from "../types/auth.types";

export class AuthService {
  static async login(
    credentials: LoginRequest,
  ): Promise<{ mappedAuth: persistUser; mustChangePassword: boolean }> {
    const response = await httpClient.instance.post<any, LoginResponse>(
      "auth/login/",
      credentials,
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Error al iniciar sesión");
    }

    const data = response.data;

    // Mapping flat response to nested structure expected by authStore.ts
    const mappedAuth: persistUser = {
      success: true,
      message: response.message || "Login exitoso",
      data: {
        usuario: {
          id: data.user_id.toString(),
          email: data.email,
          nombreCompleto:
            `${data.first_name || ""} ${data.second_name || ""} ${data.first_last_name || ""} ${data.second_last_name || ""}`.trim() ||
            data.username,
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
          refresh_token: data.refresh_token,
        },
        sesion: {
          id: data.session_id.toString(),
          sessionIdString: data.session_id.toString(),
        },
      },
    };

    return {
      mappedAuth,
      mustChangePassword: data.must_change_password,
    };
  }
}
