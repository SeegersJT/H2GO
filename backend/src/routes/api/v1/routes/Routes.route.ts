import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { RouteController } from "../../../../controllers/Route.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);
const driverRestricted = roleAuthorizationMiddleware(UserType.DRIVER);

router.get("/all", restricted, RouteController.getAll);
router.get("/", restricted, RouteController.getById);
router.post("/", restricted, RouteController.insertRoute);
router.post("/generate", restricted, RouteController.generateRoute);
router.put("/", restricted, RouteController.updateRoute);
router.delete("/", restricted, RouteController.deleteRoute);
router.get("/driver", driverRestricted, RouteController.getByDriverAndDate);

export default router;
