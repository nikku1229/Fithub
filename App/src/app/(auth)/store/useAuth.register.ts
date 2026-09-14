import { create } from "zustand";
import registerService from "../services/registerService";
import { AuthRegisterState } from "@/types/registerTypes";

const useRegister = new registerService();

export const useAuthRegister = create<AuthRegisterState>((set, get) => ({
  isLoading: false,
  error: null,

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await useRegister.registerService(payload);

      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";

      set({ isLoading: false, error: message });
      return false;
    }
  },
}));
