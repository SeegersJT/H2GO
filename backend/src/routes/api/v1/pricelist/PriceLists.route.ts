import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { PriceListController } from "../../../../controllers/PriceList.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, PriceListController.getAll);
router.get("/", restricted, PriceListController.getById);
router.post("/", restricted, PriceListController.insertPriceList);
router.put("/", restricted, PriceListController.updatePriceList);
router.delete("/", restricted, PriceListController.deletePriceList);

export default router;
