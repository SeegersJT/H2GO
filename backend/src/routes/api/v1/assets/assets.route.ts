import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { AssetController } from "../../../../controllers/Asset.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, AssetController.getAll);
router.get("/", restricted, AssetController.getById);
router.post("/", restricted, AssetController.insertAsset);
router.put("/", restricted, AssetController.updateAsset);
router.delete("/", restricted, AssetController.deleteAsset);

export default router;
