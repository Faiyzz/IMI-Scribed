import { Router } from "express";
import sessionController from "./session.controller";
import { authMiddleware } from "../../interfaces/http/middleware/auth.middleware";

const router = Router();

// All session routes are protected
router.use(authMiddleware);

router.post("/", sessionController.createSession);
router.get("/", sessionController.getSessions);
router.get("/:id", sessionController.getSessionById);
router.patch("/:id", sessionController.updateSession);

export default router;
