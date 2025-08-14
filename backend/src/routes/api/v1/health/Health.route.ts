import { Router } from "express";
import { HealthController } from "../../../../controllers/Health.controller";

const router = Router();

router.get("/", HealthController.healthCheck);

export default router;
