import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../core/config/constants";

/**
 * Hashes a plain-text password using bcrypt.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
};

/**
 * Compares a plain-text password against a bcrypt hash.
 */
export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
