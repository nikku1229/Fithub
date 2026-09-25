import { create } from "zustand";
import { clearAuthStorage } from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utilities/storagekey";
import registerService from "../services/registerService";
import { AuthRegisterState } from "@/types/registerTypes";
import { handleError } from "@/utilities/errorHandler";

const useRegister = new registerService();

const useAuthRegister = create<AuthRegisterState>((set) => ({
  user: null,
  onboardingToken: null,
  isLoading: false,
  error: null,

  register: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await useRegister.registerService(payload);

      await clearAuthStorage();
      await SecureStore.setItemAsync(
        STORAGE_KEYS.ONBOARDING_TOKEN,
        res.data.token,
      );
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER,
        JSON.stringify(res.data.user),
      );

      set({
        user: res.data.user,
        onboardingToken: res.data.token,
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
}));

export default useAuthRegister;
