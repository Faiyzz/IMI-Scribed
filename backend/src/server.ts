import app from "./app";
import { env } from "./core/config/env";
import { connectDB } from "./core/database/mongoose";
import logger from "./core/logger/logger";
import http from "http";
import { Server } from "socket.io";
import { createDeepgramConnection } from "./modules/transcript/transcript.service";
import { Session } from "./modules/session/session.model";
import { generateSoapNote } from "./modules/soap/soap.service";

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
            console.log("🟢 Client connected:", socket.id);
            let fullTranscript = "";
            let sessionId: string | null = null;
            // 👇 CREATE DG CONNECTION PER CLIENT
            const deepgramConnection = createDeepgramConnection();

            deepgramConnection.on("open", () => {
                console.log("🧠 Deepgram connected");
            });
            deepgramConnection.on("transcriptReceived", (data: any) => {
                if (!data.text) return;

                console.log(`📝 ${data.isFinal ? "FINAL" : "PARTIAL"} Transcript:`, data.text);

                // 👉 ONLY store FINAL
                if (data.isFinal) {
                    fullTranscript = `${fullTranscript} ${data.text}`.trim();
                }

                // 👉 still send to frontend
                socket.emit("transcript", data);
            });

            deepgramConnection.on("error", (err: any) => {
                console.error("Deepgram error:", err);
            });

            // 👇 LISTEN FOR SESSION ID START
            socket.on("start-session", (data: { sessionId: string }) => {
                sessionId = data.sessionId;
                console.log("🚀 Session linked to socket:", sessionId);
            });

            // 👇 STREAM AUDIO TO DG
            socket.on("audio-chunk", (chunk: ArrayBuffer) => {
                if (chunk && (chunk.byteLength > 0 || (chunk as any).length > 0)) {
                    console.log("📥 Received audio chunk:", chunk.byteLength || (chunk as any).length);
                    deepgramConnection.send(chunk);
                }
            });

            socket.on("disconnect", async () => {
                console.log("🔴 Client disconnected:", socket.id);

                deepgramConnection.finish();

                if (sessionId && fullTranscript.trim()) {
                    try {
                        // 👉 STEP 1: Generate SOAP
                        const soap = await generateSoapNote(fullTranscript);

                        // 👉 STEP 2: Save BOTH transcript + SOAP
                        await Session.findByIdAndUpdate(sessionId, {
                            rawTranscript: fullTranscript.trim(),
                            soapNote: soap,   // 👈 NEW FIELD
                            status: "completed",
                        });

                        console.log("💾 Transcript + SOAP saved");
                    } catch (err) {
                        console.error("❌ Failed to process SOAP", err);
                    }
                }
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
