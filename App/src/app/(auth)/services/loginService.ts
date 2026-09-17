import API from "@/services/api";
import { handleError } from "@/utilities/errorHandler";
import {
  type LoginPayload,
  loginPayloadSchema,
  type LoginResponse,
  loginResponseSchema,
} from "@/types/loginTypes";

class loginService {
  loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const validated = loginPayloadSchema.parse(payload);
      const res = await API.post<LoginResponse>("/auth/login", validated);
      return loginResponseSchema.parse(res.data);
    } catch (error) {
      throw new Error(handleError(error));
    }
  };
}
export default loginService;
