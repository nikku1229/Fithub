import API from "@/services/api";
import { AxiosError } from "axios";
import type { RegisterPayload, RegisterResponse } from "@/types/registerTypes";

class registerService {
  registerService = async (
    payload: RegisterPayload,
  ): Promise<RegisterResponse> => {
    try {
      const res = await API.post<RegisterResponse>("/auth/regsiter", payload);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string; error?: string }>;

      throw new Error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed",
      );
    }
  };
}

export default registerService;
