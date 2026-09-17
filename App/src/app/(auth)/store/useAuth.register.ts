import { create } from "zustand";
import registerService from "../services/registerService";
import { AuthRegisterState } from "@/types/registerTypes";
import { handleError } from "@/utilities/errorHandler";

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
      const message = handleError(error);
      set({ isLoading: false, error: message });
      return false;
    }
  },
}));

export default useAuthRegister;
