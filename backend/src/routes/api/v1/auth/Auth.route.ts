import { Router } from "express";

import { AuthController } from "../../../../controllers/Auth.controller";

const router = Router();

router.post("/login", AuthController.login);
router.post("/confirmation-token/validate", AuthController.validateConfirmationToken);
router.post("/one-time-pin", AuthController.oneTimePin);
router.post("/password-forgot", AuthController.passwordForgot);
router.post("/password-reset", AuthController.passwordReset);
router.post("/refresh-token", AuthController.refreshToken);

// INVALIDATE CONFIRMATION TOKENS AS SOON AS THEY ARE USED

export default router;
