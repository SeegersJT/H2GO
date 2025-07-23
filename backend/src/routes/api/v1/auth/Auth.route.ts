import { Router } from "express";
import * as authController from "../../../../controllers/Auth.controller";

const router = Router();

router.post("/login", authController.loginWithEmail);
router.post("/verify-otp", authController.verifyOtpLogin);

export default router;
