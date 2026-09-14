import { z } from "zod";

export const registerPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and _ allowed"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const registerResponseSchema = z.object({
  message: z.string(),
});

export interface AuthRegisterState {
  isLoading: boolean;
  error: string | null;
  register: (payload: RegisterPayload) => Promise<boolean>;
}

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
