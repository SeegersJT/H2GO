import { Router } from "express";

import { AuthController } from "../../../../controllers/Auth.controller";
import { createRateLimiter } from "../../../../middleware/RateLimiter.middleware";

const router = Router();

const authRateLimiter = createRateLimiter({ windowMs: 60_000, max: 1000 });

router.post("/login", authRateLimiter, AuthController.login);
router.post("/confirmation-token/validate", authRateLimiter, AuthController.validateConfirmationToken);
router.post("/one-time-pin", authRateLimiter, AuthController.oneTimePin);
router.post("/password-reset", authRateLimiter, AuthController.passwordReset);
router.post("/password-forgot", authRateLimiter, AuthController.passwordForgot);
router.post("/refresh-token", authRateLimiter, AuthController.refreshToken);

export default router;
