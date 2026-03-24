import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "clinician" | "viewer";
    createdAt: Date;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "clinician" | "viewer";
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface SafeUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}
