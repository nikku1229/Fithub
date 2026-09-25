import { z } from "zod";

export const loginPayloadSchema = z.object({
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

export const sessionDetailsSchema = z.object({
  id: z.string(),
  device: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const userDetailsSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  username: z.string().nullable(),
  createdAt: z.string().optional(),
});

export const loginResponseSchema = z.object({
  data: z.object({
    needsOnboarding: z.boolean(),
    accessToken: z.string().nullish(),
    onboardingToken: z.string().nullish(),
    user: userDetailsSchema,
    sessions: z.array(sessionDetailsSchema).optional(),
  }),
  message: z.string().optional(),
});

export interface AuthLoginState {
  user: UserDetails | null;
  sessions: SessionDetails[];
  accessToken: string | null;
  needsOnboarding: boolean;
  onboardingToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export type LoginPayload = z.infer<typeof loginPayloadSchema>;
export type SessionDetails = z.infer<typeof sessionDetailsSchema>;
export type UserDetails = z.infer<typeof userDetailsSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
