import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { SubscriptionController } from "../../../../controllers/Subscription.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, SubscriptionController.getAll);
router.get("/", restricted, SubscriptionController.getById);
router.post("/", restricted, SubscriptionController.insertSubscription);
router.put("/", restricted, SubscriptionController.updateSubscription);
router.delete("/", restricted, SubscriptionController.deleteSubscription);

export default router;
