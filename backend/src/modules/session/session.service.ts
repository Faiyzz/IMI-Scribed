import { Session, ISession } from "./session.model";
import { CreateSessionDto, UpdateSessionDto } from "./session.types";
import { AppError } from "../../core/errors/AppError";

class SessionService {
    async createSession(clinicianId: string, data: CreateSessionDto): Promise<ISession> {
        return await Session.create({
            clinicianId,
            patientName: data.patientName,
            status: "active",
        });
    }

    async getSessionsByClinician(clinicianId: string): Promise<ISession[]> {
        return await Session.find({ clinicianId }).sort({ createdAt: -1 });
    }

    async getSessionById(sessionId: string): Promise<ISession> {
        const session = await Session.findById(sessionId);
        if (!session) {
            throw new AppError("Session not found", 404);
        }
        return session;
    }

    async updateSession(sessionId: string, data: UpdateSessionDto): Promise<ISession> {
        const session = await Session.findByIdAndUpdate(
            sessionId,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!session) {
            throw new AppError("Session not found", 404);
        }

        return session;
    }

    async deleteSession(sessionId: string, clinicianId: string): Promise<void> {
        const session = await Session.findOneAndDelete({ _id: sessionId, clinicianId });
        if (!session) {
            throw new AppError("Session not found or not authorized", 404);
        }
    }

    /**
     * Helper to transform Mongoose doc to safe response object
     */
    toSafeSession(session: ISession) {
        return {
            id: session._id.toString(),
            clinicianId: session.clinicianId.toString(),
            patientName: session.patientName,
            patientGender: session.patientGender,
            status: session.status,
            duration: session.duration,
            transcriptId: session.transcriptId?.toString(),
            createdAt: session.createdAt,
        };
    }
}

export default new SessionService();
