import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { BranchService } from "../services/Branch.service";

export class BranchController {
  static getAllBranches = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const branches = await BranchService.getAllBranches();

      return res.success(branches, {
        message: "Retrieved branches successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static getBranchById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.params.id;
      const branch = await BranchService.getBranchById(branchId);

      return res.success(branch, {
        message: "Retrieved branch successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static insertBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branch_name, branch_abbreviation, country_id, headoffice_id = null } = req.body;

      if (!branch_name || !branch_abbreviation || !country_id) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const countryObjectId = new Types.ObjectId(country_id);
      const createdByObjectId = new Types.ObjectId(authenticatedUser.id);
      const updatedByObjectId = new Types.ObjectId(authenticatedUser.id);

      const existingBranch = await BranchService.getBranchByFields({
        branch_name,
        branch_abbreviation,
        active: true,
      });

      if (existingBranch) {
        return res.error(null, {
          message: "Branch with the same name or abbreviation already exists",
          code: StatusCode.CONFLICT,
        });
      }

      let headOfficeObjectId: Types.ObjectId | null = headoffice_id ? new Types.ObjectId(headoffice_id) : null;

      if (headOfficeObjectId) {
        const headOfficeBranch = await BranchService.getBranchByFields({
          _id: headOfficeObjectId,
          active: true,
        });

        if (!headOfficeBranch) {
          return res.error(null, {
            message: "The specified head office branch does not exist or is inactive.",
          });
        }
      }

      const newBranch = await BranchService.insertBranch({
        branch_name,
        branch_abbreviation,
        country_id: countryObjectId,
        headoffice_id: headOfficeObjectId,
        active: true,
        createdBy: createdByObjectId,
        updatedBy: updatedByObjectId,
      });

      return res.success(newBranch, {
        message: "Inserted branch successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static updateBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.params.id;

      const { branch_name, branch_abbreviation, country_id, headoffice_id } = req.body;

      if (!branch_name || !branch_abbreviation || !country_id || !headoffice_id) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const branchObjectId = new Types.ObjectId(branchId);
      const countryObjectId = new Types.ObjectId(country_id);
      const updatedByObjectId = new Types.ObjectId(authenticatedUser.id);
      const headOfficeObjectId = new Types.ObjectId(headoffice_id);

      const branchToUpdate = await BranchService.getBranchById(branchId);

      if (!branchToUpdate) {
        return res.error(null, {
          message: "Branch not found",
          code: StatusCode.NOT_FOUND,
        });
      }

      const duplicateBranch = await BranchService.getBranchByFields({
        branch_name,
        branch_abbreviation,
        headoffice_id: headOfficeObjectId,
        active: true,
        _id: { $ne: branchObjectId },
      });

      if (duplicateBranch) {
        return res.error(null, {
          message: "Another branch with the same name or abbreviation already exists",
          code: StatusCode.CONFLICT,
        });
      }

      const headOfficeBranch = await BranchService.getBranchByFields({
        _id: headOfficeObjectId,
        active: true,
      });

      if (!headOfficeBranch) {
        return res.error(null, {
          message: "The specified head office branch does not exist or is inactive.",
        });
      }

      const updatedBranch = await BranchService.updateBranch(branchId, {
        branch_name,
        branch_abbreviation,
        country_id: countryObjectId,
        headoffice_id: headOfficeObjectId ?? branchToUpdate._id,
        updatedBy: updatedByObjectId,
      });

      return res.success(updatedBranch, {
        message: "Updated branch successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static deleteBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const deletedBranch = await BranchService.softDeleteBranch(id, authenticatedUser?.id);

      if (!deletedBranch) {
        return res.error(null, {
          message: "Branch not found",
          code: StatusCode.NOT_FOUND,
        });
      }

      return res.success(deletedBranch, {
        message: "Branch deleted (soft) successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
