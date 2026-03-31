import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./core/logger/logger";
import { errorHandler } from "./core/errors/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import sessionRoutes from "./modules/session/session.routes";
import { env } from "./core/config/env";

const app: Application = express();

// Standard middlewares
app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false })); // More permissive for now
app.use(cors({ 
    origin: [/https:\/\/.*\.vercel\.app$/, "https://imi-scribed-production.up.railway.app", "http://localhost:3000", /\.vercel\.app$/],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers crash on 204
})); // Enable CORS
app.use(express.json()); // Body parsing
app.use(cookieParser()); // Cookie parsing

// HTTP Request logging
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

// Routes
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", env: env.NODE_ENV });
});

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// Remote Logger Bridge (Frontend -> Backend Terminal)
app.post("/api/logs", (req, res) => {
    const { level, message, data, source } = req.body;
    const logSource = source ? `[${source}] ` : "";
    
    switch (level) {
        case "error":
            logger.error(`${logSource}${message}`, data);
            break;
        case "warn":
            logger.warn(`${logSource}${message}`, data);
            break;
        case "debug":
            logger.debug(`${logSource}${message}`, data);
            break;
        default:
            logger.info(`${logSource}${message}`, data);
    }
    
    res.status(200).send();
});

// Global Error Handler
app.use(errorHandler);

export default app;
