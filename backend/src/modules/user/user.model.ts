import mongoose, { Schema } from "mongoose";
import { IUser } from "../auth/auth.types";

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ["admin", "clinician", "viewer"],
            default: "clinician",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Index for faster queries
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
