import axios, {
  AxiosInstance,
  AxiosHeaders,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useAuthStore } from "@/gcm-plataform/components/store/authStore";

export enum AuthType {
  BasicAuthentication = "BasicAuthentication",
  SecurityAuthentication = "SecurityAuthentication",
}

type RetriableConfig = InternalAxiosRequestConfig & { __isRetry?: boolean };

class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Espera la hidratación (sessionStorage) para no perder el token en refresh
        await useAuthStore.getState().whenHydrated();

        const headers =
          config.headers instanceof AxiosHeaders
            ? config.headers
            : new AxiosHeaders(config.headers as any);

        const authType = headers.get("X-Auth-Type") as AuthType | undefined;
        headers.delete("X-Auth-Type");

        if (authType === AuthType.SecurityAuthentication) {
          const token = await useAuthStore.getState().getValidAccessToken();
          if (token) headers.set("Authorization", `Bearer ${token}`);
          else headers.delete("Authorization");
        }

        config.headers = headers;
        return config;
      },
      (error) => Promise.reject(error),
    );

    // RESPONSE
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async (error) => {
        if (error.message === "Network Error") {
          error.message =
            "Error de conexión al servidor. Por favor, comunícate con un administrador, de momento no contamos con el servicio.";
        }

        const original = error.config as RetriableConfig | undefined;
        if (!error.response || !original || original.__isRetry) {
          return Promise.reject(error);
        }

        // 401/403 -> intenta refrescar y reintentar UNA vez
        if (error.response.status === 401 || error.response.status === 403) {
          try {
            const newToken = await useAuthStore.getState().refreshTokens();
            if (!newToken) {
              useAuthStore.getState().logout();
              return Promise.reject(error);
            }
            original.__isRetry = true;
            original.headers = new AxiosHeaders(original.headers as any);
            original.headers.set("Authorization", `Bearer ${newToken}`);
            if (!original.headers.get("X-Auth-Type")) {
              original.headers.set(
                "X-Auth-Type",
                AuthType.SecurityAuthentication,
              );
            }
            return this.axiosInstance(original);
          } catch {
            return Promise.reject(error);
          }
        }

        // Otros errores -> extraer mensaje del backend si existe
        const backendMessage =
          error.response?.data?.message || error.response?.data?.error;
        if (backendMessage) {
          error.message = backendMessage;
        }

        return Promise.reject(error);
      },
    );
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}

const httpClient = new HttpClient(process.env.NEXT_PUBLIC_API_BASE_URL || "");
export default httpClient;
