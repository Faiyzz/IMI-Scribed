import app from "./app";
import { env } from "./core/config/env";
import { connectDB } from "./core/database/mongoose";
import logger from "./core/logger/logger";
import http from "http";
import { Server } from "socket.io";
import { createDeepgramConnection } from "./modules/transcript/transcript.service";
import { Session, ISession } from "./modules/session/session.model";
import { generateSoapNote } from "./modules/soap/soap.service";
import { Patient } from "./modules/patient/patient.model";

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
                
                // console.log(`📝 ${data.isFinal ? "FINAL" : "PARTIAL"} Transcript:`, data.text);

                // 👉 ONLY store FINAL
                if (data.isFinal) {
                    fullTranscript = `${fullTranscript} ${data.text}`.trim();
                }

                // 👉 still send to frontend
                console.log(`📡 Emitting ${data.isFinal ? "FINAL" : "PARTIAL"} transcript to ${socket.id}`);
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
                    let soap = null;
                    try {
                        // 👉 STEP 1: Generate SOAP (Try)
                        soap = await generateSoapNote(fullTranscript);
                        console.log("✅ SOAP generated successfully");
                    } catch (err) {
                        console.error("⚠️ Failed to generate SOAP note, saving transcript only:", err);
                    }

                    try {
                        // 👉 STEP 1.5: Fetch session to calculate duration
                        const existingSession = await Session.findById(sessionId);
                        let duration = 0;
                        if (existingSession) {
                            duration = Math.floor((Date.now() - existingSession.createdAt.getTime()) / 1000);
                        }

                        // 👉 STEP 2: Save whatever we have
                        const updatedSession = await Session.findByIdAndUpdate(sessionId, {
                            rawTranscript: fullTranscript.trim(),
                            soapNote: soap,   
                            status: "completed",
                            duration: duration > 0 ? duration : 0,
                        }, { new: true });

                        if (updatedSession) {
                            // 👉 STEP 3: Upsert Patient
                            await Patient.findOneAndUpdate(
                                { clinicianId: updatedSession.clinicianId, name: updatedSession.patientName },
                                { 
                                    age: updatedSession.patientAge, 
                                    gender: updatedSession.patientGender,
                                    lastVisit: new Date()
                                },
                                { upsert: true, new: true }
                            );
                            console.log("💾 Session + Patient updated in DB");
                        }
                    } catch (err) {
                        console.error("❌ Fatal: Failed to save session to DB", err);
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
