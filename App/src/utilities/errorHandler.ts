import { AxiosError } from "axios";
import { ZodError } from "zod";

export const handleError = (error: unknown): string => {
  if (error instanceof ZodError) {
    const firstError = error.issues[0]?.message ?? "Validation failed";
    return firstError;
  }

  if (error instanceof AxiosError) {
    const serverMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "Network error";
    return serverMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};
