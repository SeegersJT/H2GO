import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { PaymentController } from "../../../../controllers/Payment.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.FINANCE);

router.get("/all", restricted, PaymentController.getAll);
router.get("/", restricted, PaymentController.getById);
router.post("/", restricted, PaymentController.create);
router.put("/", restricted, PaymentController.update);
router.delete("/", restricted, PaymentController.delete);

export default router;
