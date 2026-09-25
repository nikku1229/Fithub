import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utilities/storagekey";
import usernameService from "../services/usernameService";
import { AuthUsernameState } from "@/types/usernameType";
import { handleError } from "@/utilities/errorHandler";

const useUsername = new usernameService();

const useAuthUsername = create<AuthUsernameState>((set) => ({
  username: null,
  isLoading: false,
  error: null,

  setUsername: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const onboardingToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.ONBOARDING_TOKEN,
      );
      if (!onboardingToken) throw new Error("Session expired. Please login!");

      const res = await useUsername.setUsername(payload, onboardingToken);
      set({
        username: res.data.username,
        error: null,
      });
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ONBOARDING_TOKEN);
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

export default useAuthUsername;
