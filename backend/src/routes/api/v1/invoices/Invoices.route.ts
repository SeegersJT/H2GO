import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { InvoiceController } from "../../../../controllers/Invoice.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.FINANCE);

router.get("/all", restricted, InvoiceController.getAll);
router.get("/", restricted, InvoiceController.getById);
router.post("/", restricted, InvoiceController.insertInvoice);
router.put("/", restricted, InvoiceController.updateInvoice);
router.delete("/", restricted, InvoiceController.deleteInvoice);

router.get("/generate/month", restricted, InvoiceController.generateForUserAndMonth);
router.post("/generate/month", restricted, InvoiceController.generateForMonth);

export default router;
