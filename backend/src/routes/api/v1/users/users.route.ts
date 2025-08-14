import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";

import { UserController } from "../../../../controllers/User.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/all", restricted, UserController.getAllUsers);
router.get("/:id", restricted, UserController.getUserById);
router.post("/", restricted, UserController.insertUser);
router.put("/:id", restricted, UserController.updateUser);
router.delete("/:id", restricted, UserController.deleteUser);

export default router;
