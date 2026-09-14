import { z } from "zod";

export const forgotPasswordPayloadSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
});

export const verifyOtpPayloadSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export const resetPasswordPayloadSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  resetToken: z.string().min(1, "Reset token is required"),
});

export const forgotPasswordResponseSchema = z.object({
  message: z.string(),
});

export const verifyOtpResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    resetToken: z.string(),
  }),
});

export const resetPasswordResponseSchema = z.object({
  message: z.string(),
});

export interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
  error: string | null;

  sendOtp: (payload: ForgotPasswordPayload) => Promise<boolean>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<boolean>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>;
}

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordPayloadSchema>;
export type VerifyOtpPayload = z.infer<typeof verifyOtpPayloadSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordPayloadSchema>;
export type ForgotPasswordResponse = z.infer<
  typeof forgotPasswordResponseSchema
>;
export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
