import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { SubscriptionController } from "../../../../controllers/Subscription.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, SubscriptionController.getAll);
router.get("/:id", restricted, SubscriptionController.getById);
router.post("/", restricted, SubscriptionController.create);
router.put("/:id", restricted, SubscriptionController.update);
router.delete("/:id", restricted, SubscriptionController.delete);

export default router;
