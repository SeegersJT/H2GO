import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";

import { ConfirmationTokenController } from "../../../../controllers/ConfirmationToken.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/", restricted, ConfirmationTokenController.getConfirmationTokenByToken);
router.get("/validate", restricted, ConfirmationTokenController.validateConfirmationToken);
router.post("/", restricted, ConfirmationTokenController.insertConfirmationToken);
router.put("/invalidate", restricted, ConfirmationTokenController.invalidateConfirmationToken);

export default router;
