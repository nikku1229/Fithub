import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth";
import { RateLimiter } from "../../middlewares/rateLimiter";

const router = Router();
const authController = new AuthController();
const rateLimiter = new RateLimiter();

router.post("/register", rateLimiter.authLimiter, authController.register);
router.post("/login", rateLimiter.authLimiter, authController.login);
router.post(
  "/forgot-password",
  rateLimiter.authLimiter,
  authController.forgotPassword,
);
router.post("/verify-otp", rateLimiter.otpLimiter, authController.verifyOTP);
router.post(
  "/reset-password",
  rateLimiter.authLimiter,
  authController.resetPassword,
);
router.post(
  "/refresh-token",
  rateLimiter.authLimiter,
  authController.refreshToken,
);

router.post(
  "/logout",
  rateLimiter.authLimiter,
  authMiddleware,
  authController.logout,
);
router.get(
  "/profile",
  rateLimiter.generalLimiter,
  authMiddleware,
  authController.getProfile,
);
router.get(
  "/sessions",
  rateLimiter.generalLimiter,
  authMiddleware,
  authController.getActiveSessions,
);

export default router;
