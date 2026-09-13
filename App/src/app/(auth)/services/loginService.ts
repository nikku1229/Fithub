import API from "@/services/api";
import { AxiosError } from "axios";
import type { LoginPayload, LoginResponse } from "@/types/loginTypes";

class loginService {
  loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      console.log("Login service start....");
      console.log("Payload", payload);

      const res = await API.post<LoginResponse>("/auth/login", payload);

      console.log(res.data);

      return res.data;
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
