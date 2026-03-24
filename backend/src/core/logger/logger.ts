import winston from "winston";

const { combine, timestamp, printf, colorize, align } = winston.format;

// Custom log format for development
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        devFormat
    ),
    transports: [
        new winston.transports.Console({
            format: combine(colorize({ all: true })),
        }),
    ],
});

export default logger;
