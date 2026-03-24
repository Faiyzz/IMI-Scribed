import { Response } from "express";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200
): void => {
    const body: ApiResponse<T> = { success: true, message, data };
    res.status(statusCode).json(body);
};

export const sendCreated = <T>(res: Response, data: T, message = "Created"): void => {
    sendSuccess(res, data, message, 201);
};
