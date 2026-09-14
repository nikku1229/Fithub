import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utilities/storagekey";
import loginService from "../services/loginService";
import { AuthLoginState } from "@/types/loginTypes";

const useLogin = new loginService();

const useAuthLogin = create<AuthLoginState>((set, get) => ({
  user: null,
  sessions: [],
  accessToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const res = await useLogin.loginService(payload);

      await SecureStore.setItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN,
        res.data.accessToken,
      );
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER,
        JSON.stringify(res.data.user),
      );
      if (res.data.sessions) {
        await SecureStore.setItemAsync(
          STORAGE_KEYS.SESSIONS,
          JSON.stringify(res.data.sessions),
        );
      }

      set({
        user: res.data.user,
        sessions: res.data.sessions ?? [],
        accessToken: res.data.accessToken,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      set({ isLoading: false, error: message, isAuthenticated: false });
      return false;
    }
  },

  logout: async () => {},

  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      const userStr = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
      const sessionsStr = await SecureStore.getItemAsync(STORAGE_KEYS.SESSIONS);

      if (token && userStr) {
        set({
          accessToken: token,
          user: JSON.parse(userStr),
          sessions: sessionsStr ? JSON.parse(sessionsStr) : [],
          isAuthenticated: true,
        });
      }
    } catch (err) {
      console.warn("loadFromStorage failed:", err);
    }
  },
}));

export default useAuthLogin;
