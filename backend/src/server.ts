import app from "./app";
import { env } from "./core/config/env";
import { connectDB } from "./core/database/mongoose";
import logger from "./core/logger/logger";

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        const port = env.PORT;
        
        app.listen(port, () => {
            logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
        });
    } catch (error) {
        logger.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
