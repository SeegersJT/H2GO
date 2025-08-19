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

router.post("/generate/eligible", restricted, InvoiceController.generateForEligibleUsers);
router.post("/generate/current-month", restricted, InvoiceController.generateCurrentMonth);
router.post("/generate/payments-due", restricted, InvoiceController.generatePaymentsDue);
router.get("/generate/current-month/:user_id", restricted, InvoiceController.generateCurrentMonthForUser);
router.get("/generate/date-range", restricted, InvoiceController.generateByDateRange);

export default router;
