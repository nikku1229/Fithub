import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
} from "../../utils/validation";
import { AppError } from "../../utils/errorHandler";
import { extractDeviceInfo } from "../../middlewares/deviceInfo";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const result = await authService.register(validatedData);

      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const deviceInfo = extractDeviceInfo(req);

      const result = await authService.login(validatedData, deviceInfo);

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          session: result.session,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new AppError("Refresh token required", 401);
      }

      const tokens = await authService.refreshToken(refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Token revoked",
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const refreshToken = req.cookies.refreshToken;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      await authService.logout(userId, refreshToken);

      res.clearCookie("refreshToken");

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);

      await authService.forgotPassword(validatedData);

      res.status(200).json({
        message: "Otp sent to your email successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = verifyOTPSchema.parse(req.body);

      await authService.verifyOTP(validatedData);

      res.status(200).json({
        message: "OTP verified successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);

      await authService.resetPassword(validatedData);

      res.status(200).json({
        message: "Password reset successfully.",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      const user = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const sessions = await authService.getActiveSessions(userId);

      res.status(200).json({
        success: true,
        data: {
          sessions,
          count: sessions.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
