import API from "@/services/api";
import { AxiosError } from "axios";
import {
  type LoginPayload,
  loginPayloadSchema,
  type LoginResponse,
  loginResponseSchema,
} from "@/types/loginTypes";

class loginService {
  loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      console.log("Login service start....");
      console.log("Payload", payload);
      const validated = loginPayloadSchema.parse(payload);

      const res = await API.post<LoginResponse>("/auth/login", validated);

      return loginResponseSchema.parse(res.data);
    } catch (error) {
      const err = error as AxiosError<{ message?: string; error?: string }>;

      throw new Error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed",
      );
    }
  };
}
export default loginService;
