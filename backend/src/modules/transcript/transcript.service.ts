import { DeepgramClient } from "@deepgram/sdk";
import { EventEmitter } from "events";

/**
 * Interface for the compatibility wrapper that matches the old Deepgram v2 API.
 * This resolves TypeScript errors in server.ts when calling .send() and .finish().
 */
export interface DeepgramConnection extends EventEmitter {
    send: (data: any) => void;
    finish: () => void;
}

const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY! });

/**
 * Constants for WebSocket readyState
 */
const WS_READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};

export const createDeepgramConnection = (): DeepgramConnection => {
    const emitter = new EventEmitter() as DeepgramConnection;
    let socketInstance: any = null;
    const buffer: any[] = [];

    // Use 'connect' as it is the base method in the SDK type definitions.
    // Use an 'any' cast as the SDK types are too restrictive for optional fields.
    (deepgram.listen.v1 as any).connect({
        model: "nova-2",
        smart_format: true,
        interim_results: true,
        diarize: true,
    }).then((socket: any) => {
        socketInstance = socket;
        
        // v5 requires calling connect() explicitly
        socket.connect();

        const flushBuffer = () => {
            if (!socketInstance || socketInstance.readyState !== WS_READY_STATE.OPEN) return;
            
            while (buffer.length > 0) {
                const chunk = buffer.shift();
                try {
                    socketInstance.sendMedia(chunk);
                } catch (err: any) {
                    // If it suddenly closed, put the chunk back at the start and stop flushing
                    if (err.message?.includes("not open")) {
                        buffer.unshift(chunk);
                        break;
                    }
                    emitter.emit("error", err);
                }
            }
        };

        socket.on("open", () => {
            emitter.emit("open");
            // Small delay to ensure internal readyState is fully synchronized
            setTimeout(flushBuffer, 50);
        });

        socket.on("message", (data: any) => {
            // In v5, transcript data comes in 'Results' message type
            if (data.type === "Results" && data.channel?.alternatives?.[0]) {
                emitter.emit("transcriptReceived", data);
            }
            emitter.emit("message", data);
        });

        socket.on("error", (err: any) => {
            emitter.emit("error", err);
        });

        socket.on("close", () => {
            emitter.emit("close");
        });

        // Add compatibility methods for the existing server.ts
        emitter.send = (data: any) => {
            if (socketInstance && socketInstance.readyState === WS_READY_STATE.OPEN) {
                try {
                    socketInstance.sendMedia(data);
                } catch (err: any) {
                    if (err.message?.includes("not open")) {
                        buffer.push(data);
                    } else {
                        emitter.emit("error", err);
                    }
                }
            } else {
                // Buffer the data until the connection is open
                buffer.push(data);
            }
        };
        
        emitter.finish = () => {
            try {
                if (socketInstance) {
                    socketInstance.close();
                }
            } catch (err) {
                 emitter.emit("error", err);
            }
        };

        (emitter as any).socket = socket;
    }).catch((err: any) => {
        emitter.emit("error", err);
    });

    // Provide placeholder methods in case they are called before the promise resolves
    if (!emitter.send) {
        emitter.send = (data: any) => {
            buffer.push(data);
        };
    }
    if (!emitter.finish) {
        emitter.finish = () => {
            // Nothing to finish yet
        };
    }

    return emitter;
};