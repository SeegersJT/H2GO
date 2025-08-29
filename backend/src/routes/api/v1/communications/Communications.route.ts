import { Router } from "express";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { UserType } from "../../../../utils/constants/UserType.constant";
import { CommunicationController } from "../../../../controllers/Communication.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.post("/", restricted, CommunicationController.send);

export default router;
