import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
    clinicianId: mongoose.Types.ObjectId;
    patientName: string;
    patientGender: "male" | "female" | "other" | "prefer_not_to_say";
    status: "active" | "completed" | "draft";
    duration: number; // in seconds
    transcriptId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
    {
        clinicianId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Clinician ID is required"],
        },
        patientName: {
            type: String,
            required: [true, "Patient name is required"],
            trim: true,
        },
        patientGender: {
            type: String,
            enum: ["male", "female", "other", "prefer_not_to_say"],
            required: [true, "Patient gender is required"],
        },
        status: {
            type: String,
            enum: ["active", "completed", "draft"],
            default: "active",
        },
        duration: {
            type: Number,
            default: 0,
        },
        transcriptId: {
            type: Schema.Types.ObjectId,
            ref: "Transcript",
        },
    },
    {
        timestamps: true,
    }
);

export const Session = mongoose.model<ISession>("Session", SessionSchema);
