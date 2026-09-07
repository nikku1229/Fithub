import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import { generateTokens } from "../../config/jwt";
import { AppError } from "../../utils/errorHandler";
import type { RegisterInput, LoginInput } from "../../utils/validation";

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

    const tokens = generateTokens(user.id, user.email, user.username);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
      },
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    };

    return { user: userData, tokens };
  }

  async login(data: LoginInput) {
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

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
      },
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    };

    return { user: userData, tokens };
  }
}
