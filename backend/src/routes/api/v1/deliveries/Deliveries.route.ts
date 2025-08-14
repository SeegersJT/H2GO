import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { DeliveryController } from "../../../../controllers/Delivery.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, DeliveryController.getAll);
router.get("/:id", restricted, DeliveryController.getById);
router.post("/", restricted, DeliveryController.create);
router.put("/:id", restricted, DeliveryController.update);
router.delete("/:id", restricted, DeliveryController.delete);

export default router;
