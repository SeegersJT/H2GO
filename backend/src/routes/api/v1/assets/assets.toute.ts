import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { AssetController } from "../../../../controllers/Asset.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, AssetController.getAll);
router.get("/:id", restricted, AssetController.getById);
router.post("/", restricted, AssetController.create);
router.put("/:id", restricted, AssetController.update);
router.delete("/:id", restricted, AssetController.delete);

export default router;
