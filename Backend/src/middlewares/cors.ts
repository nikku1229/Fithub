import cors, { type CorsOptions } from "cors";
import dotenv from "dotenv";

const allowedOrigins: string[] = (
  process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-CSRF-Token",
  ],
  exposedHeaders: ["X-Total-Count", "RateLimit-Limit", "RateLimit-Remaining"],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

export const corsMiddleware = cors(corsOptions);
