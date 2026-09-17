import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utilities/storagekey";
import forgotService from "../services/forgotService";
import { ForgotPasswordState } from "@/types/forgotTypes";
import { handleError } from "@/utilities/errorHandler";

const useAuthForgot = new forgotService();

const useAuthForgotStore = create<ForgotPasswordState>((set) => ({
  email: "",
  isLoading: false,
  error: null,

  sendOtp: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      await useAuthForgot.forgotPasswordService(payload);
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const message = handleError(error);
      set({ isLoading: false, error: message });
      return false;
    }
  },

  verifyOtp: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await useAuthForgot.verifyOtpService(payload);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.RESET_TOKEN,
        JSON.stringify(res.data.resetToken),
      );
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const message = handleError(error);
      set({ isLoading: false, error: message });
      return false;
    }
  },

  resetPassword: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await useAuthForgot.resetPasswordService(payload);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.RESET_TOKEN);
      set({ isLoading: false, error: null, email: "" });
      return true;
    } catch (error) {
      const message = handleError(error);
      set({ isLoading: false, error: message });
      return false;
    }
  },
}));

export default useAuthForgotStore;
