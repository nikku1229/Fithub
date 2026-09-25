import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utilities/storagekey";
import loginService from "../services/loginService";
import { AuthLoginState } from "@/types/loginTypes";
import { handleError } from "@/utilities/errorHandler";
import { clearAuthStorage } from "@/services/api";

const useLogin = new loginService();

const useAuthLogin = create<AuthLoginState>((set, get) => ({
  user: null,
  sessions: [],
  accessToken: null,
  onboardingToken: null,
  needsOnboarding: false,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await useLogin.loginService(payload);

      if (res.data.needsOnboarding) {
        await clearAuthStorage();
        await SecureStore.setItemAsync(
          STORAGE_KEYS.ONBOARDING_TOKEN,
          res.data?.onboardingToken as string,
        );
        await SecureStore.setItemAsync(
          STORAGE_KEYS.USER,
          JSON.stringify(res.data.user),
        );

        set({
          error: null,
          user: res.data.user,
          onboardingToken: res.data?.onboardingToken,
          needsOnboarding: true,
        });
        return true;
      }

      await clearAuthStorage();
      await SecureStore.setItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN,
        res.data?.accessToken as string,
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
        isAuthenticated: true,
        error: null,
      });
      return true;
    } catch (error) {
      const message = handleError(error);
      set({ error: message });
      return false;
    } finally {
      set({ isLoading: false });
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
    } catch (error) {
      console.warn("loadFromStorage failed:", error);
    }
  },
}));

export default useAuthLogin;
