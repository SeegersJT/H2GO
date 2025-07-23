import { Router } from "express";
import * as oneTimePinController from "../../../../controllers/OneTimePin.controller";

const router = Router();

router.get("/", oneTimePinController.getOneTimePinByConfirmationTokenId);

router.post("/", oneTimePinController.insertOneTimePin);

export default router;
