import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { PriceListController } from "../../../../controllers/PriceList.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, PriceListController.getAll);
router.get("/:id", restricted, PriceListController.getById);
router.post("/", restricted, PriceListController.create);
router.put("/:id", restricted, PriceListController.update);
router.delete("/:id", restricted, PriceListController.delete);

export default router;
