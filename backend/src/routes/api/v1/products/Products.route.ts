import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";
import { ProductController } from "../../../../controllers/Product.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.ADMIN);

router.get("/all", restricted, ProductController.getAll);
router.get("/", restricted, ProductController.getById);
router.post("/", restricted, ProductController.insertProduct);
router.put("/", restricted, ProductController.updateProduct);
router.delete("/", restricted, ProductController.deleteProduct);

export default router;
