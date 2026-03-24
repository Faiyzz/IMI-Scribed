import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../core/config/env";
import { User } from "../../../modules/user/user.model";
import { AppError } from "../../../core/errors/AppError";
import { JwtPayload } from "../../../modules/auth/auth.types";
import { AuthService } from "../../../modules/auth/auth.service";

/**
 * Middleware to protect routes and identify the current user via JWT.
 * Expects Bearer token in 'Authorization' header.
 */
export const authMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError("You are not logged in. Please log in to get access.", 401));
        }

        // Verify token
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        // Check if user still exists
        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
            return next(new AppError("The user belonging to this token no longer exists.", 401));
        }

        // Add user object to request
        (req as any).user = AuthService.toSafeUser(currentUser);
        next();
    } catch (error) {
        next(new AppError("Invalid token or session expired.", 401));
    }
};
