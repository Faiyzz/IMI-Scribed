import app from "./app";
import { env } from "./core/config/env";
import { connectDB } from "./core/database/mongoose";
import logger from "./core/logger/logger";
import http from "http";
import { Server } from "socket.io";
import { createDeepgramConnection } from "./modules/transcript/transcript.service";


const startServer = async () => {
    try {
        await connectDB();

        const port = env.PORT;

        // 👇 CREATE HTTP SERVER
        const server = http.createServer(app);

        // 👇 ATTACH SOCKET.IO
        const io = new Server(server, {
            cors: {
                origin: "*",
            },
        });

        // 👇 SOCKET CONNECTION
        io.on("connection", (socket) => {
            logger.info(`🟢 Client connected: ${socket.id}`);

            // 👇 CREATE DG CONNECTION PER CLIENT
            const dgConnection = createDeepgramConnection();

            dgConnection.on("open", () => {
                logger.info("🧠 Deepgram connected");
            });

            dgConnection.on("transcriptReceived", (data: any) => {
                const transcript = data.channel?.alternatives?.[0]?.transcript || "";

                if (transcript) {
                    logger.info(`📝 ${data.is_final ? "FINAL" : "PARTIAL"} Transcript: ${transcript}`);

                    // 👇 send back to frontend with metadata
                    socket.emit("transcript", {
                        text: transcript,
                        isFinal: data.is_final
                    });
                }
            });

            dgConnection.on("error", (err: any) => {
                logger.error("Deepgram error:", err);
            });

            // 👇 STREAM AUDIO TO DG
            socket.on("audio-chunk", (chunk) => {
                dgConnection.send(chunk);
            });

            socket.on("disconnect", () => {
                logger.info(`🔴 Client disconnected: ${socket.id}`);
                dgConnection.finish(); // 👈 VERY IMPORTANT
            });
        });

        // 👇 START SERVER (IMPORTANT CHANGE)
        server.listen(port, () => {
            logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
        });

    } catch (error) {
        logger.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
