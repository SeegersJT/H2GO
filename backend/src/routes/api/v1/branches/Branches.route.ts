import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";

import { BranchController } from "../../../../controllers/Branch.controller";

const router = Router();

// const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/all", BranchController.getAllBranches);
router.get("/:id", BranchController.getBranchById);
router.post("/", BranchController.insertBranch);
router.put("/:id", BranchController.updateBranch);
router.delete("/:id", BranchController.deleteBranch);

export default router;
