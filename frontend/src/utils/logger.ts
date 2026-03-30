"use client";

import { getApiUrl } from "./api";

const LOG_ENDPOINT = `${getApiUrl()}/api/logs`;

type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Enhanced Frontend Logger
 * Automatically mirrors client-side logs to the backend terminal
 */
const platformLogger = {
    log: (level: LogLevel, message: string, data?: any) => {
        // Always log to browser console for local dev
        const consoleMethod = level === "debug" ? "debug" : level === "warn" ? "warn" : level === "error" ? "error" : "log";
        console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || "");

        // Send to backend bridge
        fetch(LOG_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                level, 
                message, 
                data,
                source: "frontend-client",
                timestamp: new Date().toISOString()
            }),
        }).catch(() => {
            // Silently fail if backend is unreachable 
            // We don't want to crash the UI for a failed log
        });
    },

    info: (message: string, data?: any) => platformLogger.log("info", message, data),
    warn: (message: string, data?: any) => platformLogger.log("warn", message, data),
    error: (message: string, data?: any) => platformLogger.log("error", message, data),
    debug: (message: string, data?: any) => platformLogger.log("debug", message, data),
};

export default platformLogger;
