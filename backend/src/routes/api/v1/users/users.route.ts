import { Router } from "express";
import * as userController from "../../../../controllers/User.controller";

const router = Router();

router.get("/all", userController.getAllUsers);
router.get("/:id", userController.getUserById);

router.post("/", userController.insertUser);

export default router;
