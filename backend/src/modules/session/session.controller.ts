import { Request, Response } from "express";
import sessionService from "./session.service";
import { sendSuccess, sendCreated } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";

class SessionController {
    createSession = asyncHandler(async (req: Request, res: Response) => {
        const clinicianId = (req as any).user.id;
        const session = await sessionService.createSession(clinicianId, req.body);
        
        sendCreated(res, {
            session: sessionService.toSafeSession(session)
        }, "Session started successfully");
    });

    getSessions = asyncHandler(async (req: Request, res: Response) => {
        const clinicianId = (req as any).user.id;
        const sessions = await sessionService.getSessionsByClinician(clinicianId);

        sendSuccess(res, {
            sessions: sessions.map(s => sessionService.toSafeSession(s))
        });
    });

    getSessionById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const session = await sessionService.getSessionById(id as string);
        
        sendSuccess(res, {
            session: sessionService.toSafeSession(session)
        });
    });

    updateSession = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const session = await sessionService.updateSession(id as string, req.body);
        
        sendSuccess(res, {
            session: sessionService.toSafeSession(session)
        }, "Session updated successfully");
    });
}

export default new SessionController();
