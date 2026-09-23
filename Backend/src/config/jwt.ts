import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { randomUUID } from "crypto";
import prisma from "./prisma";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as StringValue;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as StringValue;
const JWT_ONBOARDING_SECRET = process.env.JWT_ONBOARDING_SECRET as StringValue;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY as StringValue;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY as StringValue;
const ONBOARDING_TOKEN_EXPIRY = process.env
  .ONBOARDING_TOKEN_EXPIRY as StringValue;

export const generateTokens = (
  userId: string,
  email: string,
  username: string | null,
) => {
  const payload = { userId, email, username };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

export const generateUsernameToken = async (id: string) => {
  const jti = randomUUID();

  const usernameToken = jwt.sign(
    { userId: id, scope: "onboarding", jti },
    JWT_ONBOARDING_SECRET,
    { expiresIn: ONBOARDING_TOKEN_EXPIRY },
  );

  await prisma.user.update({
    where: { id },
    data: {
      onboardingTokenJti: jti,
      onboardingTokenUsed: false,
    },
  });

  return { usernameToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

export const verifyUsernameToken = (token: string) => {
  return jwt.verify(token, JWT_ONBOARDING_SECRET);
};
