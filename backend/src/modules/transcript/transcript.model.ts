import mongoose, { Schema, Document } from "mongoose";

export interface ITranscript extends Document {
    sessionId: mongoose.Types.ObjectId;
    rawText: string;
    structuredNote?: {
        subjective?: string;
        objective?: string;
        assessment?: string;
        plan?: string;
    };
    accuracyScore?: number;
    createdAt: Date;
    updatedAt: Date;
}

const TranscriptSchema: Schema = new Schema(
    {
        sessionId: {
            type: Schema.Types.ObjectId,
            ref: "Session",
            required: [true, "Session ID is required"],
        },
        rawText: {
            type: String,
            required: [true, "Raw text is required"],
        },
        structuredNote: {
            subjective: String,
            objective: String,
            assessment: String,
            plan: String,
        },
        accuracyScore: {
            type: Number,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

export const Transcript = mongoose.model<ITranscript>("Transcript", TranscriptSchema);
