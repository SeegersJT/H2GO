import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import * as branchService from "../services/Branch.service";

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

    // const isDuplicateUserIDNumber = await userService.isDuplicateUserIDNumber(id_number);
    // if (isDuplicateUserIDNumber) {
    //   return res.fail(null, { message: "Duplicate ID number", code: StatusCode.BAD_REQUEST });
    // }

    // const isDuplicateUserEmailAddress =
    //   await userService.isDuplicateUserEmailAddress(email_address);
    // if (isDuplicateUserEmailAddress) {
    //   return res.fail(null, { message: "Duplicate Email Address", code: StatusCode.BAD_REQUEST });
    // }

    if (headoffice_id !== null) {
      const isActiveBranch = await branchService.getBranchByFields({
        branch_name: branch_name,
        branch_abbreviation: branch_abbreviation,
        headoffice_id: headoffice_id,
      });
      console.log("isActiveBranch", isActiveBranch);
    }

    const newBranch = await branchService.insertBranch({
      branch_name,
      branch_abbreviation,
      country_id: new Types.ObjectId(country_id),
      headoffice_id: headoffice_id,
      active: true,
      createdBy: new Types.ObjectId(createdBy),
      updatedBy: new Types.ObjectId(updatedBy),
    });

    return res.succeed(newBranch, {
      message: "Inserted branch successfully",
    });
  } catch (err) {
    next(err);
  }
};
