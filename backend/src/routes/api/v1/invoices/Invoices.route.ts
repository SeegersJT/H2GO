import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { InvoiceController } from "../../../../controllers/Invoice.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.FINANCE);

router.get("/all", restricted, InvoiceController.getAll);
router.get("/:id", restricted, InvoiceController.getById);
router.post("/", restricted, InvoiceController.create);
router.put("/:id", restricted, InvoiceController.update);
router.delete("/:id", restricted, InvoiceController.delete);

export default router;
