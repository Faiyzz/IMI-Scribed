import jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import { AppError } from "../../core/errors/AppError";
import { env } from "../../core/config/env";
import { hashPassword, comparePassword } from "../../utils/crypto";
import { 
    RegisterDto, 
    LoginDto, 
    IUser, 
    JwtPayload, 
    SafeUser 
} from "./auth.types";

export class AuthService {
    /**
     * Registers a new user
     */
    static async register(data: RegisterDto): Promise<{ user: SafeUser; token: string }> {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new AppError("User with this email already exists", 409);
        }

        const hashedPassword = await hashPassword(data.password);
        
        const user = await User.create({
            ...data,
            password: hashedPassword,
        });

        const token = this.generateToken(user);
        
        return {
            user: this.toSafeUser(user),
            token,
        };
    }

    /**
     * Authenticates a user and returns a token
     */
    static async login(data: LoginDto): Promise<{ user: SafeUser; token: string }> {
        const user = await User.findOne({ email: data.email }).select("+password");
        
        if (!user || !(await comparePassword(data.password, user.password))) {
            throw new AppError("Invalid email or password", 401);
        }

        const token = this.generateToken(user);

        return {
            user: this.toSafeUser(user),
            token,
        };
    }

    /**
     * Generates a JWT for a user
     */
    private static generateToken(user: IUser): string {
        const payload: JwtPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        return jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as any,
        });
    }

    /**
     * Converts a full user document to a safe object for the client
     */
    static toSafeUser(user: IUser): SafeUser {
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}
