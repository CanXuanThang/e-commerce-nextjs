import { LoginResponse } from "@/models/auth";
import axios, { AxiosError } from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean; // Flag đánh dấu request đã retry hay chưa
  }
}

const API_HOST = process.env.NEXT_PUBLIC_URL_API;
const REFRESH_TOKEN_URL = "/auth/refresh-token";

export const axiosDefaultConfig = {
  baseURL: API_HOST,
  headers: { "Content-Type": "application/json" },
};
export const axiosDefaultFormDataConfig = {
  baseURL: API_HOST,
  headers: { "Content-Type": "multipart/form-data" },
};
const axiosClient = axios.create(axiosDefaultConfig);

// Flag để kiểm soát việc refresh token, tránh gọi đồng thời nhiều lần
// Khi isRefreshing = true, tất cả request khác sẽ chờ trong queue
let isRefreshing = false;

// Queue chứa các callback function của những request đang chờ refresh token hoàn thành
// Khi refresh xong, tất cả callback trong array này sẽ được gọi để tiếp tục request
let refreshSubscribers: ((token: string) => void)[] = [];

// Hàm lấy timestamp hiện tại đã được đồng bộ với server
// Server trả về time trong response header, client tính diff và lưu vào localStorage
const getTimestamp = (): number => {
  const diff = localStorage.getItem("diff"); // Độ lệch thời gian với server
  return Math.floor(Date.now() / 1000) + (diff ? parseInt(diff) : 0);
};

const isValidToken = (token: string | null): boolean =>
  !!token?.trim() &&
  !["null", "undefined"].some((invalid) => token.includes(invalid));

// Lưu token và thông tin user vào localStorage sau khi refresh thành công
const saveTokens = (data: LoginResponse): void => {
  const { accessToken, refreshToken } = data;
  setCookie(null, "accessToken", accessToken);
  setCookie(null, "refreshToken", refreshToken);
};

export const clearAuthAndRedirect = async (): Promise<void> => {
  const cookies = parseCookies();
  destroyCookie(null, "accessToken");
  destroyCookie(null, "refreshToken");
  window.location.replace(`/${cookies.locale}/login`);
};

// Hàm gọi API refresh token để lấy accessToken mới
const refreshTokenFn = async (): Promise<string> => {
  const cookies = parseCookies();

  const tokens: LoginResponse = {
    accessToken: cookies.accessToken ?? "",
    refreshToken: cookies.refreshToken ?? "",
  };

  // Gọi API refresh token với dữ liệu đã mã hóa
  const response = await axiosClient.post(REFRESH_TOKEN_URL, {
    headers: {
      "Content-Type": "application/json",
      "Client-Type": "Web",
      "X-Language": cookies.locale ?? "vi",
    },
  });

  if (!response.data?.success) throw new Error("Failed to refresh token");

  saveTokens(response.data.data);
  return response.data.data.accessToken;
};

// Hàm quản lý việc refresh token với cơ chế queue để tránh refresh đồng thời
// QUAN TRỌNG để xử lý concurrent requests khi token hết hạn
const handleTokenRefresh = async (): Promise<void> => {
  if (isRefreshing) {
    // ===== TRƯỜNG HỢP 1: Đã có process refresh đang chạy =====
    // Request hiện tại sẽ chờ trong queue cho đến khi refresh hoàn thành
    await new Promise<void>((resolve) => {
      // Thêm callback vào queue, sẽ được gọi khi refresh xong
      refreshSubscribers.push(() => resolve());

      // Timeout 10s để tránh deadlock nếu refresh bị treo
      setTimeout(resolve, 10000);
    });
  } else {
    // ===== TRƯỜNG HỢP 2: Chưa có process refresh nào =====
    // Request hiện tại sẽ đảm nhận việc refresh token
    isRefreshing = true; // Đánh dấu đang refresh, các request khác sẽ chờ

    try {
      await refreshTokenFn(); // Thực hiện refresh token

      // Sau khi refresh thành công, thông báo cho tất cả request đang chờ
      refreshSubscribers.forEach((cb) => cb("")); // Gọi tất cả callback trong queue
      refreshSubscribers = []; // Reset queue
    } finally {
      // Dù thành công hay thất bại, luôn reset flag để cho phép refresh lần sau
      isRefreshing = false;
    }
  }
};

// Interceptor này chạy TRƯỚC KHI request được gửi đi
// Nhiệm vụ: Kiểm tra auth, refresh token nếu cần, set headers, mã hóa dữ liệu
axiosClient.interceptors.request.use(
  async function (config) {
    // Lấy token hiện tại từ localStorage
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // BƯỚC 1: PHÂN LOẠI REQUEST
    // Kiểm tra xem có phải request authentication không (login, refresh token...)
    const isAuthRequest =
      config.url?.includes("/auth/") || config.url?.includes(REFRESH_TOKEN_URL);

    if (!isAuthRequest) {
      // XỬ LÝ AUTHENTICATION CHO PROTECTED ENDPOINTS

      // Trường hợp 1: Không có token nào hợp lệ → Logout ngay
      if (!isValidToken(accessToken) && !isValidToken(refreshToken)) {
        clearAuthAndRedirect().catch(console.error);
        return Promise.reject(new Error("No valid tokens"));
      }

      // Trường hợp 2: AccessToken hết hạn nhưng refreshToken còn hạn → Refresh token
      if (!isValidToken(accessToken) && isValidToken(refreshToken)) {
        try {
          await handleTokenRefresh(); // Refresh token và chờ hoàn thành
        } catch (error) {
          clearAuthAndRedirect().catch(console.error);
          return Promise.reject(error);
        }
      }
    }

    // SET HEADERS CHO REQUEST
    if (config.headers) {
      // Set Authorization header nếu có accessToken hợp lệ
      if (isValidToken(localStorage.getItem("accessToken"))) {
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          "accessToken",
        )}`;
      }
      const cookies = parseCookies();
      const locale = cookies.locale;

      // Set các headers bắt buộc cho tất cả request
      config.headers["Client-Type"] = "Web";
      config.headers["X-Language"] = locale ?? "vi";
    }

    return config; // Trả về config đã được xử lý
  },
  (error) => Promise.reject(error),
);

// Interceptor này chạy SAU KHI nhận được response từ server
// Nhiệm vụ: Xử lý version checking, time sync, error handling, retry logic
axiosClient.interceptors.response.use(
  // XỬ LÝ RESPONSE THÀNH CÔNG
  (response) => response,
  // XỬ LÝ RESPONSE LỖI
  async (error: AxiosError) => {
    const cookies = parseCookies();
    const originalRequest = error.config; // Request gốc bị lỗi
    const isAuthError =
      error.response?.status === 401 ||
      (error.response?.data &&
        typeof (error.response.data as any)?.code === "string" &&
        (error.response.data as any)?.code === "03"); // Lỗi authentication 03
    const isAuthRequest =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes(REFRESH_TOKEN_URL);
    const isLogoutError =
      error.response?.data &&
      typeof (error.response.data as any)?.code === "string" &&
      (error.response.data as any)?.code === "04"; // Điều kiện mở modal logout

    // Điều kiện retry: có originalRequest, lỗi 401, không phải auth request, chưa retry
    if (
      originalRequest &&
      isAuthError &&
      !isAuthRequest &&
      !originalRequest._retry // Flag tránh infinite loop
    ) {
      // Kiểm tra có refreshToken hợp lệ không
      if (!isValidToken(cookies.refreshToken)) {
        // Không có refreshToken → Logout
        clearAuthAndRedirect().catch(console.error);
        return Promise.reject(error);
      }

      // Đánh dấu đã retry để tránh infinite loop
      originalRequest._retry = true;

      try {
        // Refresh token và chờ hoàn thành
        await handleTokenRefresh();

        // Cập nhật Authorization header với token mới
        originalRequest.headers!["Authorization"] =
          `Bearer ${cookies.accessToken}`;

        // Retry request với token mới
        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearAuthAndRedirect().catch(console.error);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
