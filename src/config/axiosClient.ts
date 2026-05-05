import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { LoginResponse } from "@/types/auth";

const API_HOST = process.env.NEXT_PUBLIC_URL_API;
const REFRESH_TOKEN_URL = "/auth/refresh-token";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_HOST,
  headers: { "Content-Type": "application/json" },
});

const axiosRefresh: AxiosInstance = axios.create({
  baseURL: API_HOST,
});

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const isValidToken = (token?: string) =>
  !!token && token !== "null" && token !== "undefined";

const saveTokens = (data: LoginResponse) => {
  setCookie(null, "accessToken", data.accessToken);
  setCookie(null, "refreshToken", data.refreshToken);
};

export const clearAuthAndRedirect = () => {
  const cookies = parseCookies();

  destroyCookie(null, "accessToken");
  destroyCookie(null, "refreshToken");

  if (typeof window !== "undefined") {
    localStorage.clear();
    if (
      window.location.pathname.includes("/admin") ||
      window.location.pathname.includes("/payment")
    ) {
      window.location.href = `/${cookies.locale || "vi"}/login`;
    } else {
      window.location.href = `/${cookies.locale || "vi"}`;
    }
  }
};

const refreshTokenFn = async (): Promise<string> => {
  const cookies = parseCookies();

  if (!isValidToken(cookies.refreshToken)) {
    throw new Error("No refresh token");
  }

  const response = await axiosRefresh.post(
    REFRESH_TOKEN_URL,
    {
      refreshToken: cookies.refreshToken,
    },
    {
      headers: {
        "Client-Type": "Web",
        "X-Language": cookies.locale ?? "vi",
      },
    },
  );

  if (!response.data?.success) {
    throw new Error("Refresh token failed");
  }

  const data: LoginResponse = response.data.data;

  saveTokens(data);

  return data.accessToken;
};

const handleTokenRefresh = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const newToken = await refreshTokenFn();

    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];

    return newToken;
  } catch (error) {
    refreshQueue = [];
    throw error;
  } finally {
    isRefreshing = false;
  }
};

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const cookies = parseCookies();

    const accessToken = cookies.accessToken;
    const locale = cookies.locale ?? "vi";

    if (config.headers) {
      if (isValidToken(accessToken)) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      config.headers["Client-Type"] = "Web";
      config.headers["X-Language"] = locale;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const cookies = parseCookies();

    const isAuthError =
      error.response?.status === 401 ||
      (error.response?.data &&
        typeof (error.response.data as any)?.code === "string" &&
        (error.response.data as any)?.code === "03");

    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes(REFRESH_TOKEN_URL);

    if (isAuthError && !isAuthRequest && !originalRequest._retry) {
      if (!isValidToken(cookies.refreshToken)) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newToken = await handleTokenRefresh();

        // update header with fresh token
        originalRequest.headers!["Authorization"] = `Bearer ${newToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
