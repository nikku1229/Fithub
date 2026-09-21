import { z } from "zod";

export const registerPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
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

export const userRegisterSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string().optional(),
});

export const registerResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    user: userRegisterSchema,
  }),
  message: z.string().optional(),
});

export interface AuthRegisterState {
  user: userRegisterDetails | null;
  usernameToken: string | null;
  isLoading: boolean;
  error: string | null;

  register: (payload: RegisterPayload) => Promise<boolean>;
}

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
export type userRegisterDetails = z.infer<typeof userRegisterSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
