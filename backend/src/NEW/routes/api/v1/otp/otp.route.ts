import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";

import { OneTimePinController } from "../../../../controllers/OneTimePin.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/", restricted, OneTimePinController.getOneTimePinByConfirmationTokenId);
router.post("/", restricted, OneTimePinController.insertOneTimePin);

export default router;
