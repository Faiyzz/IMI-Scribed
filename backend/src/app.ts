import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./core/errors/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import { env } from "./core/config/env";

const app: Application = express();

// Standard middlewares
app.use(helmet()); // Security headers
app.use(cors({ origin: true, credentials: true })); // Enable CORS
app.use(express.json()); // Body parsing
app.use(cookieParser()); // Cookie parsing

// Routes
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", env: env.NODE_ENV });
});

app.use("/api/auth", authRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
