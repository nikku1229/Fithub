import { create } from "zustand";
import registerService from "../services/registerService";
import { AuthRegisterState } from "@/types/registerTypes";

const useRegister = new registerService();

const useAuthRegister = create<AuthRegisterState>((set) => ({
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

export default useAuthRegister;
