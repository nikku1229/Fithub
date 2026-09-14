import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../utilities/storagekey";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) console.log("Backend url not provided");

const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Token fetch failed in request interceptor:", error);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

API.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken) => {
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            resolve(API(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await API.post("/auth/refresh-token");

        const newAccessToken =
          refreshResponse.data?.accessToken ||
          refreshResponse.data.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        await SecureStore.setItemAsync(
          STORAGE_KEYS.ACCESS_TOKEN,
          newAccessToken,
        );

        pendingQueue.forEach((cb) => cb(newAccessToken));
        pendingQueue = [];

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return API(originalRequest);
      } catch (refreshError) {
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        await clearAuthStorage();

        // TODO: yahan auth store ka logout trigger karna (baad me)
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export const clearAuthStorage = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.SESSIONS);
};

export default API;
