import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { DeliveryController } from "../../../../controllers/Delivery.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, DeliveryController.getAll);
router.get("/", restricted, DeliveryController.getById);
router.post("/", restricted, DeliveryController.insertDelivery);
router.put("/", restricted, DeliveryController.updateDelivery);
router.delete("/", restricted, DeliveryController.deleteDelivery);

export default router;
