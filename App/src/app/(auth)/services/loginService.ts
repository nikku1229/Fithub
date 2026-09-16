import API from "@/services/api";
import { AxiosError } from "axios";
import {
  type LoginPayload,
  loginPayloadSchema,
  type LoginResponse,
  loginResponseSchema,
} from "@/types/loginTypes";

class loginService {
  loginService = async (payload: LoginPayload) => {
    try {
      const validated = loginPayloadSchema.parse(payload);
      const res = await API.post<LoginResponse>("/auth/login", validated);
      return loginResponseSchema.parse(res.data);
    } catch (error) {
      const err = error as AxiosError;

      throw new Error(err.message);
    }
  };
}
export default loginService;
