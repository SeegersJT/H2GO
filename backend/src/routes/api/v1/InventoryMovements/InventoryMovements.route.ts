import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { InventoryMovementController } from "../../../../controllers/InventoryMovement.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.WAREHOUSE_MANAGER);

router.get("/all", restricted, InventoryMovementController.getAll);
router.get("/:id", restricted, InventoryMovementController.getById);
router.post("/", restricted, InventoryMovementController.create);
router.put("/:id", restricted, InventoryMovementController.update);
router.delete("/:id", restricted, InventoryMovementController.delete);

export default router;
