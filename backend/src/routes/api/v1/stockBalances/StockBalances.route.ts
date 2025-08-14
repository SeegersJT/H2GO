import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { StockBalanceController } from "../../../../controllers/StockBalance.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.WAREHOUSE_MANAGER);

router.get("/all", restricted, StockBalanceController.getAll);
router.get("/:id", restricted, StockBalanceController.getById);
router.post("/", restricted, StockBalanceController.create);
router.put("/:id", restricted, StockBalanceController.update);
router.delete("/:id", restricted, StockBalanceController.delete);

export default router;
