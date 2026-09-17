import API from "@/services/api";
import { handleError } from "@/utilities/errorHandler";
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
      throw new Error(handleError(error));
    }
  };
}

export default registerService;
