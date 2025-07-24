import { Router } from "express";

import { AuthController } from "../../../../controllers/Auth.controller";

const router = Router();

router.post("/login", AuthController.loginWithEmail);
router.post("/one-time-pin", AuthController.oneTimePinLogin);
router.post("/password-reset", AuthController.passwordResetLogin);
router.post("/refresh-token", AuthController.refreshToken);

export default router;
