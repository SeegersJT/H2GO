import { Router } from "express";
import { UserType } from "../../../../utils/constants/UserType.constant";
import roleAuthorizationMiddleware from "../../../../middleware/RoleAuthorization.middleware";

import { BranchController } from "../../../../controllers/Branch.controller";

const router = Router();

const restricted = roleAuthorizationMiddleware(UserType.DEVELOPER);

router.get("/all", restricted, BranchController.getAllBranches);
router.get("/:id", restricted, BranchController.getBranchById);
router.post("/", restricted, BranchController.insertBranch);
router.put("/:id", restricted, BranchController.updateBranch);
router.delete("/:id", restricted, BranchController.deleteBranch);

export default router;
