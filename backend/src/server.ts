import app from "./app";
import { env } from "./core/config/env";
import { connectDB } from "./core/database/mongoose";

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        const port = env.PORT;
        
        app.listen(port, () => {
            console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
