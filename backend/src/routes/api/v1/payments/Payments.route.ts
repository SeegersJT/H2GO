import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { PaymentController } from "../../../../controllers/Payment.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.FINANCE);

router.get("/all", restricted, PaymentController.getAll);
router.get("/:id", restricted, PaymentController.getById);
router.post("/", restricted, PaymentController.create);
router.put("/:id", restricted, PaymentController.update);
router.delete("/:id", restricted, PaymentController.delete);

export default router;
