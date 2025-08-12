import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { AddressController } from "../../../../controllers/Address.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, AddressController.getAllAddresses);
router.get("/", restricted, AddressController.getAddressbyId);
router.get("/by-user", restricted, AddressController.getAddressbyUserId);

export default router;
