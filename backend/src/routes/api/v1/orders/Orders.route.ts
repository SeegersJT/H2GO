import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { OrderController } from "../../../../controllers/Order.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, OrderController.getAll);
router.get("/:id", restricted, OrderController.getById);
router.post("/", restricted, OrderController.create);
router.put("/:id", restricted, OrderController.update);
router.delete("/:id", restricted, OrderController.delete);

export default router;
