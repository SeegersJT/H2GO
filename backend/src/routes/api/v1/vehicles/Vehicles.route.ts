import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { VehicleController } from "../../../../controllers/Vehicle.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, VehicleController.getAll);
router.get("/", restricted, VehicleController.getById);
router.post("/", restricted, VehicleController.insertVehicle);
router.put("/", restricted, VehicleController.updateVehicle);
router.delete("/", restricted, VehicleController.deleteVehicle);

export default router;
