import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
    clinicianId: mongoose.Types.ObjectId;
    name: string;
    age: number;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    lastVisit: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PatientSchema: Schema = new Schema(
    {
        clinicianId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Clinician ID is required"],
        },
        name: {
            type: String,
            required: [true, "Patient name is required"],
            trim: true,
        },
        age: {
            type: Number,
            required: [true, "Patient age is required"],
            min: 0,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other", "prefer_not_to_say"],
            required: [true, "Patient gender is required"],
        },
        lastVisit: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search optimization
PatientSchema.index({ clinicianId: 1, name: 1 });

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
