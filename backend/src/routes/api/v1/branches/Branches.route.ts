import { Router } from "express";
import * as branchController from "../../../../controllers/Branch.controller";

const router = Router();

router.get("/all", branchController.getAllBranches);
router.get("/:id", branchController.getBranchById);

router.post("/", branchController.insertBranch);

export default router;
