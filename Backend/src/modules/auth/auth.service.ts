import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import { generateTokens, verifyRefreshToken } from "../../config/jwt";
import { AppError } from "../../utils/errorHandler";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  VerifyOTPInput,
  ResetPasswordInput,
} from "../../utils/validation";
import type { JwtPayload } from "jsonwebtoken";
import type { DeviceInfo } from "../../types";
import { generateOtp, sendOtpEmail } from "../../utils/otpHandler";
import crypto from "crypto";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");

export class AuthService {
  async register(data: RegisterInput) {
    const { email, password, name, username } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exist", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "User",
        username,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        createdAt: true,
      },
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    };

    return { user: userData };
  }

  async login(data: LoginInput, deviceInfo: DeviceInfo) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid Email Id", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid Password", 401);
    }

    const tokens = generateTokens(user.id, user.email, user.username);

    const existingSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        deviceInfo: deviceInfo.deviceName,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingSession) {
      await prisma.session.update({
        where: { id: existingSession.id },
        data: {
          isActive: false,
          expiresAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        deviceInfo: deviceInfo.deviceName,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        isActive: true,
        lastUsedAt: new Date(),
      },
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    };

    return {
      user: userData,
      tokens,
      session: {
        id: session.id,
        deviceInfo: session.deviceInfo,
        expiresAt: session.expiresAt,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken) as JwtPayload;

      const session = await prisma.session.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!session) {
        throw new AppError("Session not found", 401);
      }

      if (!session.isActive || session.expiresAt < new Date()) {
        throw new AppError("Session expired or inactive", 401);
      }

      const user = session.user;
      if (!user) {
        throw new AppError("User not found", 404);
      }

      const tokens = generateTokens(user.id, user.email, user.username);

      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          lastUsedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return tokens;
    } catch (error) {
      if (refreshToken) {
        await prisma.session.updateMany({
          where: {
            token: refreshToken,
            isActive: true,
          },
          data: {
            isActive: false,
            expiresAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.session.updateMany({
        where: {
          userId: userId,
          token: refreshToken,
          isActive: true,
        },
        data: {
          isActive: false,
          expiresAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.session.updateMany({
        where: {
          userId: userId,
          isActive: true,
        },
        data: {
          isActive: false,
          expiresAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return { success: true };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async getActiveSessions(userId: string) {
    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: {
        lastUsedAt: "desc",
      },
    });

    return sessions;
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const existingOTP = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
        isUsed: false,
      },
    });

    if (existingOTP) {
      await prisma.passwordReset.update({
        where: { id: existingOTP.id },
        data: {
          isUsed: true,
          updatedAt: new Date(),
        },
      });
    }
    const otp = generateOtp();

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        otp: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isUsed: false,
      },
    });

    try {
      await sendOtpEmail(user.email, otp, user.name);
    } catch (error) {
      throw new AppError("Failed to send OTP email", 500);
    }

    return { success: true };
  }

  async verifyOTP(data: VerifyOTPInput) {
    try {
      const { email, otp } = data;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const otpRecord = await prisma.passwordReset.findFirst({
        where: {
          userId: user.id,
          otp: otp,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) {
        throw new AppError("Invalid or expired OTP", 400);
      }

      const resetToken = crypto.randomBytes(32).toString("hex");

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: resetToken,
          resetTokenExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      await prisma.passwordReset.update({
        where: { id: otpRecord.id },
        data: {
          isUsed: true,
          updatedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      throw new AppError("Failed to verify OTP", 500);
    }
  }

  async resetPassword(data: ResetPasswordInput) {
    try {
      const { email, newPassword } = data;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const isValidToken = await prisma.user.findFirst({
        where: {
          id: user.id,
          resetToken: user.resetToken,
          resetTokenExpires: { gt: new Date() },
        },
      });

      if (
        !isValidToken ||
        !user.resetToken ||
        !user.resetTokenExpires ||
        user.resetTokenExpires < new Date()
      ) {
        throw new AppError(
          "Reset token expired. Please request a new OTP",
          400,
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null,
        },
      });

      await prisma.session.updateMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        data: {
          isActive: false,
          expiresAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      throw new AppError("Failed to reset password", 500);
    }
  }
}
