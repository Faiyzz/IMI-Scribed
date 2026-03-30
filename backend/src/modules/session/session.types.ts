import { ISession } from "./session.model";

export interface CreateSessionDto {
    patientName: string;
    patientAge: number;
    patientGender: "male" | "female" | "other" | "prefer_not_to_say";
}

export interface UpdateSessionDto {
    status?: "active" | "completed" | "draft";
    duration?: number;
    transcriptId?: string;
}

export interface SessionResponse {
    id: string;
    clinicianId: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
    status: string;
    duration: number;
    transcriptId?: string;
    createdAt: Date;
}
