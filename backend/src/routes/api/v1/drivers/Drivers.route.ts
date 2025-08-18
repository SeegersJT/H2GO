import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { DriverController } from "../../../../controllers/Driver.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, DriverController.getAll);
router.get("/", restricted, DriverController.getById);
router.post("/", restricted, DriverController.insertDriver);
router.put("/", restricted, DriverController.updateDriver);
router.delete("/", restricted, DriverController.deleteDriver);

export default router;
