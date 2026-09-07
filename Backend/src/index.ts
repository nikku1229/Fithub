import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import prisma from "./config/prisma";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (!PORT) console.error("Port not provided");

app.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "Hello from pulse!" });
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Backend running perfectly" });
});

app.use("/api/v1/auth", authRoutes);

const server = app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Database connected successfully`);
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
