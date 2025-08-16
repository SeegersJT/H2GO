import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { CustomerController } from "../../../../controllers/Customer.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, CustomerController.getAll);
router.get("/:id", restricted, CustomerController.getById);
router.post("/", restricted, CustomerController.insertCustomer);
router.put("/:id", restricted, CustomerController.updateCustomer);
router.delete("/:id", restricted, CustomerController.deleteCustomer);

export default router;
