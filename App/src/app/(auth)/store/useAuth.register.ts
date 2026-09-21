import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utilities/storagekey";
import registerService from "../services/registerService";
import { AuthRegisterState } from "@/types/registerTypes";
import { handleError } from "@/utilities/errorHandler";

const useRegister = new registerService();

const useAuthRegister = create<AuthRegisterState>((set) => ({
  user: null,
  usernameToken: null,
  isLoading: false,
  error: null,

  register: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await useRegister.registerService(payload);

      await SecureStore.setItemAsync(
        STORAGE_KEYS.USERNAME_TOKEN,
        res.data.token,
      );
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER,
        JSON.stringify(res.data.user),
      );

      set({
        user: res.data.user,
        usernameToken: res.data.token,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const message = handleError(error);
      set({ isLoading: false, error: message });
      return false;
    }
  },
}));

export default useAuthRegister;
