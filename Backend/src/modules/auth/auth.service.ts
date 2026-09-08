import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import { generateTokens, verifyRefreshToken } from "../../config/jwt";
import { AppError } from "../../utils/errorHandler";
import type { RegisterInput, LoginInput } from "../../utils/validation";
import type { JwtPayload } from "jsonwebtoken";
import type { DeviceInfo } from "../../types";

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
}
