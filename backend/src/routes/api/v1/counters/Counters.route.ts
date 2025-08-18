import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { CounterController } from "../../../../controllers/Counter.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/", restricted, CounterController.getNextSequence);

export default router;
