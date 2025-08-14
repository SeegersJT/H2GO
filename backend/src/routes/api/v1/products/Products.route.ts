import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { ProductController } from "../../../../controllers/Product.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, ProductController.getAll);
router.get("/:id", restricted, ProductController.getById);
router.post("/", restricted, ProductController.create);
router.put("/:id", restricted, ProductController.update);
router.delete("/:id", restricted, ProductController.delete);

export default router;
