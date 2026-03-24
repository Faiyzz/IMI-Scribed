import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../interfaces/http/middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// Protected route example
router.get("/me", authMiddleware, AuthController.me);

export default router;
