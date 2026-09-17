import API from "@/services/api";
import { AxiosError } from "axios";
import { handleError } from "@/utilities/errorHandler";
import type {
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
  ForgotPasswordResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
} from "@/types/forgotTypes";
import {
  forgotPasswordPayloadSchema,
  forgotPasswordResponseSchema,
  verifyOtpPayloadSchema,
  verifyOtpResponseSchema,
  resetPasswordPayloadSchema,
  resetPasswordResponseSchema,
} from "@/types/forgotTypes";

class forgotService {
  forgotPasswordService = async (
    payload: ForgotPasswordPayload,
  ): Promise<ForgotPasswordResponse> => {
    try {
      const validated = forgotPasswordPayloadSchema.parse(payload);
      const res = await API.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        validated,
      );
      return forgotPasswordResponseSchema.parse(res.data);
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  verifyOtpService = async (
    payload: VerifyOtpPayload,
  ): Promise<VerifyOtpResponse> => {
    try {
      const validated = verifyOtpPayloadSchema.parse(payload);

      const res = await API.post<VerifyOtpResponse>(
        "/auth/verify-otp",
        validated,
      );
      return verifyOtpResponseSchema.parse(res.data);
    } catch (error) {
      throw new Error(handleError(error));
    }
  };

  resetPasswordService = async (
    payload: ResetPasswordPayload,
  ): Promise<ResetPasswordResponse> => {
    try {
      const validated = resetPasswordPayloadSchema.parse(payload);
      const res = await API.post<ResetPasswordResponse>(
        "/auth/reset-password",
        validated,
      );
      return resetPasswordResponseSchema.parse(res.data);
    } catch (error) {
      throw new Error(handleError(error));
    }
  };
}

export default forgotService;
