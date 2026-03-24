import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../../utils/response";
import { AppError } from "../../core/errors/AppError";

export class AuthController {
    /**
     * POST /api/auth/register
     */
    static register = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            throw new AppError("Please provide all required fields", 400);
        }

        const data = await AuthService.register({ name, email, password, role });
        
        sendCreated(res, data, "User registered successfully");
    });

    /**
     * POST /api/auth/login
     */
    static login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError("Please provide email and password", 400);
        }

        const data = await AuthService.login({ email, password });
        
        sendSuccess(res, data, "Login successful");
    });

    /**
     * GET /api/auth/me
     */
    static me = asyncHandler(async (req: Request, res: Response) => {
        // req.user is set by authMiddleware
        if (!(req as any).user) {
            throw new AppError("User not found", 404);
        }
        
        sendSuccess(res, { user: (req as any).user }, "Current user fetched successfully");
    });

    /**
     * POST /api/auth/logout
     */
    static logout = asyncHandler(async (_req: Request, res: Response) => {
        // Client should delete the token.
        // On server-side, if using cookies, clear the cookie.
        // For now, we'll just send success.
        sendSuccess(res, null, "Logout successful. Please delete your token.");
    });
}
