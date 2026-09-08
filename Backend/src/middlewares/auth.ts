import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { AppError } from "../utils/errorHandler";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export const authMiddleware = (
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

    const decoded = verifyAccessToken(token) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
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
