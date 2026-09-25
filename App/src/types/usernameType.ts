import { z } from "zod";

export const usernamePayloadScheme = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and _ allowed"),
});

export const usernameResponseSchema = z.object({
  data: z.object({
    username: z.string(),
  }),
  message: z.string().optional(),
});

export interface AuthUsernameState {
  isLoading: boolean;
  error: string | null;
  username: string | null;

  setUsername: (payload: UsernamePayload) => Promise<boolean>;
}

export type UsernamePayload = z.infer<typeof usernamePayloadScheme>;
export type UsernameResponse = z.infer<typeof usernameResponseSchema>;
