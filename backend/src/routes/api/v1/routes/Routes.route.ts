import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { RouteController } from "../../../../controllers/Route.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.BRANCH_ADMIN);

router.get("/all", restricted, RouteController.getAll);
router.get("/", restricted, RouteController.getById);
router.post("/", restricted, RouteController.create);
router.put("/", restricted, RouteController.update);
router.delete("/", restricted, RouteController.delete);

export default router;
