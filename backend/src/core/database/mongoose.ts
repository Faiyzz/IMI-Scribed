import mongoose from "mongoose";
import { env } from "../config/env";
import logger from "../logger/logger";

export const connectDB = async (): Promise<void> => {
    try {
        // Enable Mongoose debugging in dev mode
        if (env.NODE_ENV !== "production") {
            mongoose.set("debug", (collectionName, method, query, doc) => {
                logger.debug(`Mongoose: ${collectionName}.${method}`, { 
                    query: JSON.stringify(query), 
                    doc: JSON.stringify(doc) 
                });
            });
        }

        const conn = await mongoose.connect(env.MONGO_URI);
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
