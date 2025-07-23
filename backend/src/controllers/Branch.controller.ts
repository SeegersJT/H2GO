import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import * as branchService from "../services/Branch.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export const getAllBranches = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const branches = await branchService.getAllBranches();

    return res.succeed(branches, {
      message: "Retrieved branches successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getBranchById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = req.params.id;
    const branch = await branchService.getBranchById(branchId);

    return res.succeed(branch, {
      message: "Retrieved branch successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const insertBranch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      branch_name,
      branch_abbreviation,
      country_id,
      headoffice_id = null,
      createdBy,
      updatedBy,
    } = req.body;

    if (!branch_name || !branch_abbreviation || !country_id || !createdBy || !updatedBy) {
      return res.fail(null, { message: "Missing required fields" });
    }

    const countryObjectId = new Types.ObjectId(country_id);
    const createdByObjectId = new Types.ObjectId(createdBy);
    const updatedByObjectId = new Types.ObjectId(updatedBy);

    const existingBranch = await branchService.getBranchByFields({
      branch_name,
      branch_abbreviation,
      active: true,
    });

    if (existingBranch) {
      return res.fail(null, {
        message: "Branch with the same name or abbreviation already exists",
        code: StatusCode.CONFLICT,
      });
    }

    let headOfficeObjectId: Types.ObjectId | null = headoffice_id
      ? new Types.ObjectId(headoffice_id)
      : null;

    if (headOfficeObjectId) {
      const headOfficeBranch = await branchService.getBranchByFields({
        _id: headOfficeObjectId,
        active: true,
      });

      if (!headOfficeBranch) {
        return res.fail(null, {
          message: "The specified head office branch does not exist or is inactive.",
        });
      }
    }

    const newBranch = await branchService.insertBranch({
      branch_name,
      branch_abbreviation,
      country_id: countryObjectId,
      headoffice_id: headOfficeObjectId,
      active: true,
      createdBy: createdByObjectId,
      updatedBy: updatedByObjectId,
    });

    if (!headOfficeObjectId) {
      newBranch.headoffice_id = newBranch._id as Types.ObjectId;
      await newBranch.save();
    }

    return res.succeed(newBranch, {
      message: "Inserted branch successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = req.params.id;

    const { branch_name, branch_abbreviation, country_id, headoffice_id, updatedBy } = req.body;

    if (!branch_name || !branch_abbreviation || !country_id || !headoffice_id || !updatedBy) {
      return res.fail(null, { message: "Missing required fields" });
    }

    const branchObjectId = new Types.ObjectId(branchId);
    const countryObjectId = new Types.ObjectId(country_id);
    const updatedByObjectId = new Types.ObjectId(updatedBy);
    const headOfficeObjectId = new Types.ObjectId(headoffice_id);

    const branchToUpdate = await branchService.getBranchById(branchId);

    if (!branchToUpdate) {
      return res.fail(null, {
        message: "Branch not found",
        code: StatusCode.NOT_FOUND,
      });
    }

    const duplicateBranch = await branchService.getBranchByFields({
      branch_name,
      branch_abbreviation,
      headoffice_id: headOfficeObjectId,
      active: true,
      _id: { $ne: branchObjectId },
    });

    if (duplicateBranch) {
      return res.fail(null, {
        message: "Another branch with the same name or abbreviation already exists",
        code: StatusCode.CONFLICT,
      });
    }

    const headOfficeBranch = await branchService.getBranchByFields({
      _id: headOfficeObjectId,
      active: true,
    });

    if (!headOfficeBranch) {
      return res.fail(null, {
        message: "The specified head office branch does not exist or is inactive.",
      });
    }

    const updatedBranch = await branchService.updateBranch(branchId, {
      branch_name,
      branch_abbreviation,
      country_id: countryObjectId,
      headoffice_id: headOfficeObjectId ?? branchToUpdate._id,
      updatedBy: updatedByObjectId,
    });

    return res.succeed(updatedBranch, {
      message: "Updated branch successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBranch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedBranch = await branchService.softDeleteBranch(id);

    if (!deletedBranch) {
      return res.fail(null, {
        message: "Branch not found",
        code: StatusCode.NOT_FOUND,
      });
    }

    return res.succeed(deletedBranch, {
      message: "Branch deleted (soft) successfully",
    });
  } catch (err) {
    next(err);
  }
};
