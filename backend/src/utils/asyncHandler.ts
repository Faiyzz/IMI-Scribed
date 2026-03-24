import { Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps async route handlers to avoid repetitive try/catch.
 * Forwards errors to Express's global error handler.
 */
export const asyncHandler =
    (fn: AsyncHandler) =>
    (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch(next);
    };
