import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { AddressController } from "../../../../controllers/Address.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, AddressController.getAll);
router.get("/", restricted, AddressController.getById);
router.post("/", restricted, AddressController.insertAddress);
router.put("/", restricted, AddressController.updateAddress);
router.delete("/", restricted, AddressController.deleteAddress);

export default router;
