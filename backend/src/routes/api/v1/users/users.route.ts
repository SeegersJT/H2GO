import { Router } from "express";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { UserType } from "../../../../utils/constants/UserType.constant";

import { UserController } from "../../../../controllers/User.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);
const adminRestricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, UserController.getAllUsers);
router.get("/", restricted, UserController.getUserById);
router.post("/", restricted, UserController.insertUser);
router.put("/", restricted, UserController.updateUser);
router.delete("/", restricted, UserController.deleteUser);

router.get("/customers", adminRestricted, UserController.getAllCustomers);

export default router;
