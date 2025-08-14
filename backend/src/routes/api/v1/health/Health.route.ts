import { Router } from "express";
import { HealthController } from "../../../../controllers/Health.controller";
import { createRateLimiter } from "../../../../middleware/RateLimiter.middleware";

const router = Router();

const healthRateLimiter = createRateLimiter({ windowMs: 60_000, max: 10 });

router.get("/", healthRateLimiter, HealthController.healthCheck);

export default router;
