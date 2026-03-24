import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { env } from "../config/env";

interface ErrorResponse {
    success: false;
    message: string;
    stack?: string;
}

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Mongoose duplicate key
    if ("code" in err && (err as NodeJS.ErrnoException).code === "11000") {
        statusCode = 409;
        message = "A record with this value already exists.";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your session has expired. Please log in again.";
    }

    const body: ErrorResponse = { success: false, message };
    if (!env.isProd) body.stack = err.stack;

    res.status(statusCode).json(body);
};
