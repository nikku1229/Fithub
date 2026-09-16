import API from "@/services/api";
import { AxiosError } from "axios";
import {
  type RegisterPayload,
  type RegisterResponse,
  registerPayloadSchema,
  registerResponseSchema,
} from "@/types/registerTypes";

class registerService {
  registerService = async (
    payload: RegisterPayload,
  ): Promise<RegisterResponse> => {
    try {
      const validated = registerPayloadSchema.parse(payload);
      const res = await API.post<RegisterResponse>("/auth/regsiter", validated);
      return registerResponseSchema.parse(res.data);
    } catch (error) {
      const err = error as AxiosError;

      throw new Error(err.message);
    }
  };
}

export default registerService;
