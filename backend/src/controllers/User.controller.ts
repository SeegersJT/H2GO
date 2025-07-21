import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { getNextSequence } from "../services/Counter.service";
import * as userService from "../services/User.service";
import { Utils } from "../utils/Utils";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();

    return res.succeed(users, {
      message: "Retrieved users successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);

    return res.succeed(user, {
      message: "Retrieved user successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const insertUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      branch_id,
      name,
      surname,
      id_number,
      email_address,
      mobile_number,
      gender,
      password,
      user_type,
      createdBy,
      updatedBy,
    } = req.body;

    if (
      !branch_id ||
      !name ||
      !surname ||
      !id_number ||
      !email_address ||
      !mobile_number ||
      !password ||
      !user_type ||
      !createdBy ||
      !updatedBy
    ) {
      return res.fail(null, { message: "Missing required fields" });
    }

    // Guard Clausing!
    // const currentBranch = await branchService.getBranchById(branch_id);
    // console.log('currentBranch', currentBranch)

    const isDuplicateUserIDNumber = await userService.isDuplicateUserIDNumber(id_number);
    if (isDuplicateUserIDNumber) {
      return res.fail(null, { message: "Duplicate ID number", code: StatusCode.BAD_REQUEST });
    }

    const isDuplicateUserEmailAddress =
      await userService.isDuplicateUserEmailAddress(email_address);
    if (isDuplicateUserEmailAddress) {
      return res.fail(null, { message: "Duplicate Email Address", code: StatusCode.BAD_REQUEST });
    }

    const nextUserNo = await getNextSequence("user_no");

    const newUser = await userService.insertUser({
      user_no: Utils.generateID("USER", "H2GO", nextUserNo),
      branch_id: new Types.ObjectId(branch_id),
      name,
      surname,
      id_number,
      email_address,
      mobile_number,
      gender,
      password,
      user_type,
      confirmed: false,
      active: true,
      createdBy: new Types.ObjectId(createdBy),
      updatedBy: new Types.ObjectId(updatedBy),
    });

    return res.succeed(newUser, {
      message: "Inserted user successfully",
    });
  } catch (err) {
    next(err);
  }
};
