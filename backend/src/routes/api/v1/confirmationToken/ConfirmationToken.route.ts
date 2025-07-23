import { Router } from "express";
import * as confirmationTokenController from "../../../../controllers/ConfirmationToken.controller";

const router = Router();

router.get("/", confirmationTokenController.getConfirmationTokenByToken);
router.get("/validate", confirmationTokenController.validateConfirmationToken);

router.post("/", confirmationTokenController.insertConfirmationToken);

router.put("/invalidate", confirmationTokenController.invalidateConfirmationToken);

export default router;
