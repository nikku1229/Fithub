import { create } from "zustand";
import forgotService from "../services/forgotService";
import { ForgotPasswordState } from "@/types/forgotTypes";

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
      const message =
        error instanceof Error ? error.message : "Failed to send OTP";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  verifyOtp: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await useAuthForgot.verifyOtpService(payload);
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to Verify OTP";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  resetPassword: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await useAuthForgot.resetPasswordService(payload);
      set({ isLoading: false, error: null, email: "" });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to Update Password";
      set({ isLoading: false, error: message });
      return false;
    }
  },
}));

export default useAuthForgotStore;
