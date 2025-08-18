import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { OrderController } from "../../../../controllers/Order.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, OrderController.getAll);
router.get("/", restricted, OrderController.getById);
router.post("/", restricted, OrderController.insertOrder);
router.put("/", restricted, OrderController.updateOrder);
router.delete("/", restricted, OrderController.deleteOrder);
router.post("/generate", restricted, OrderController.generateForDate);

export default router;
