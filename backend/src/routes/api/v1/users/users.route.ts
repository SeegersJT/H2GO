import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";

import { UserController } from "../../../../controllers/User.controller";

const router = Router();

// const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/all", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.insertUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
