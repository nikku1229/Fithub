import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { AppError } from "../utils/errorHandler";
import prisma from "../config/prisma";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
  session?: {
    id: string;
    token: string;
    expiresAt: Date;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token) as JwtPayload;
    } catch (error) {
      throw new AppError("Access token expired", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        isDeleted: true,
        deletedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 401);
    }

    // if (user.isDeleted || (user.deletedAt && user.deletedAt < new Date())) {
    //   throw new AppError("User account is deactivated", 401);
    // }

    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        lastUsedAt: "desc",
      },
    });

    if (!session) {
      throw new AppError("Session expired", 401);
    }

    await prisma.session.update({
      where: { id: session.id },
      data: {
        lastUsedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
    req.session = {
      id: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
    };

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

// export const adminMiddleware = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   if (req.user?.role !== "ADMIN") {
//     throw new AppError("Admin access required", 403);
//   }
//   next();
// };
