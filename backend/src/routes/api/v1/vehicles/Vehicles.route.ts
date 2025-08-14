import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { VehicleController } from "../../../../controllers/Vehicle.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, VehicleController.getAll);
router.get("/:id", restricted, VehicleController.getById);
router.post("/", restricted, VehicleController.create);
router.put("/:id", restricted, VehicleController.update);
router.delete("/:id", restricted, VehicleController.delete);

export default router;
