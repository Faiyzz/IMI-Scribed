import { DeepgramClient } from "@deepgram/sdk";
import { EventEmitter } from "events";
import { env } from "../../core/config/env";

/**
 * Interface for the compatibility wrapper that matches the Deepgram SDK API.
 */
export interface DeepgramConnection extends EventEmitter {
    send: (data: any) => void;
    finish: () => void;
}

const deepgram = new DeepgramClient({ apiKey: env.DEEPGRAM_API_KEY });

export const createDeepgramConnection = (): DeepgramConnection => {
    const emitter = new EventEmitter() as DeepgramConnection;
    const buffer: any[] = [];
    let liveClient: any = null;
    let isOpen = false;

    // --- Create connection asynchronously
    (deepgram.listen.v1 as any).connect({
        model: "nova-2",
        smart_format: true,
        interim_results: true,
        diarize: true,
    }).then((client: any) => {
        liveClient = client;

        // In some v5 versions, you must call connect() to start the socket
        if (typeof client.connect === "function") {
            client.connect();
        }

        client.on("open", () => {
            console.log("🟢 Deepgram socket OPEN");
            isOpen = true;
            emitter.emit("open");
            
            // Flush any buffered data
            while (buffer.length > 0) {
                const chunk = buffer.shift();
                if (typeof client.sendMedia === "function") {
                    client.sendMedia(chunk);
                } else if (typeof client.send === "function") {
                    client.send(chunk);
                }
            }
        });

        const handleResults = (data: any) => {
            if (data.channel?.alternatives?.[0]) {
                const transcript = data.channel.alternatives[0].transcript;
                if (transcript && transcript.trim()) {
                    emitter.emit("transcriptReceived", {
                        text: transcript,
                        isFinal: !!(data.is_final || data.isFinal),
                    });
                }
            }
        };

        client.on("Results", handleResults);

        // Fallback for older v5 or different configurations
        client.on("message", (data: any) => {
            if (data.type === "Results") {
                handleResults(data);
            }
        });

        client.on("error", (err: any) => {
            console.error("❌ Deepgram socket error:", err);
            emitter.emit("error", err);
        });

        client.on("close", () => {
            console.log("🔒 Deepgram socket CLOSED");
            isOpen = false;
            emitter.emit("close");
        });
    }).catch((err: any) => {
        console.error("❌ Failed to connect to Deepgram:", err);
        emitter.emit("error", err);
    });

    emitter.send = (data: any) => {
        if (liveClient && isOpen) {
            try {
                // Use sendMedia (v5) or send (common fallback)
                if (typeof liveClient.sendMedia === "function") {
                    liveClient.sendMedia(data);
                } else if (typeof liveClient.send === "function") {
                    liveClient.send(data);
                }
            } catch (err) {
                console.error("Error sending to Deepgram:", err);
            }
        } else {
            buffer.push(data);
        }
    };

    emitter.finish = () => {
        if (liveClient) {
            try {
                if (typeof liveClient.finish === "function") {
                    liveClient.finish();
                } else if (typeof liveClient.close === "function") {
                    liveClient.close();
                }
            } catch (err) {
                // ignore
            }
        }
    };

    return emitter;
};