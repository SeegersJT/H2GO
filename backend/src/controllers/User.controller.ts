import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { getNextSequence } from "../services/Counter.service";
import { Utils } from "../utils/Utils";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { RegexPatterns } from "../utils/constants/Regex.constant";

import * as userService from "../services/User.service";
import * as branchService from "../services/Branch.service";
import * as countryService from "../services/Country.service";
import { hashPassword } from "../utils/Password.util";

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
    let { branch_id, name, surname, id_number, email_address, mobile_number, gender, password, user_type, createdBy, updatedBy } = req.body;

    if (!branch_id || !name || !surname || !id_number || !email_address || !mobile_number || !password || !user_type || !createdBy || !updatedBy) {
      return res.fail(null, { message: "Missing required fields" });
    }

    const branchObjectId = new Types.ObjectId(branch_id);
    const createdObjectId = new Types.ObjectId(createdBy);
    const updatedByObjectId = new Types.ObjectId(updatedBy);

    // Guard Clausing!

    // NAME VALIDATION
    if (!RegexPatterns.VALIDATE_NAME.test(name)) {
      return res.fail(null, {
        message: "Invalid name. Must start with a capital letter and contain only letters.",
      });
    }

    // SURNAME VALIDATION
    if (!RegexPatterns.VALIDATE_SURNAME.test(surname)) {
      return res.fail(null, {
        message: "Invalid surname. Must start with a capital letter and contain only letters.",
      });
    }

    // GENDER VALIDATION
    if (!RegexPatterns.VALIDATE_GENDER.test(gender)) {
      return res.fail(null, { message: 'Gender must be either "Male" or "Female"' });
    }

    //EMAIL VALIDATION
    if (!RegexPatterns.VALIDATE_EMAIL.test(email_address)) {
      return res.fail(null, {
        message: "Invalid email address.",
      });
    }

    // BRANCH VALIDATION
    const branch = await branchService.getBranchById(branch_id);
    if (!branch) {
      return res.fail(null, {
        message: "Invalid or inactive branch",
        code: StatusCode.BAD_REQUEST,
      });
    }

    // COUNTRY VALIDATION
    const country = await countryService.getCountryById(branch.country_id.toString());
    if (!country) {
      return res.fail(null, {
        message: "Invalid or inactive country",
        code: StatusCode.BAD_REQUEST,
      });
    }

    if (country?.country_code === "ZA") {
      // MOBILE NUMBER VALIDATION
      if (!RegexPatterns.VALIDATE_MOBILE_SOUTH_AFRICA.test(mobile_number)) {
        return res.fail(null, { message: "Invalid South African mobile number." });
      }

      mobile_number = Utils.normalizeMobileNumber(mobile_number, country.country_dial_code);

      // ID NUMBER VALIDATION
      if (!RegexPatterns.VALIDATE_ID_SOUTH_AFRICA.test(id_number)) {
        return res.fail(null, { message: "Invalid South African ID number." });
      }
    }

    const isDuplicateUserIDNumber = await userService.isDuplicateUserIDNumber(id_number);
    if (isDuplicateUserIDNumber) {
      return res.fail(null, { message: "Duplicate ID number", code: StatusCode.BAD_REQUEST });
    }

    const isDuplicateUserEmailAddress = await userService.isDuplicateUserEmailAddress(email_address);
    if (isDuplicateUserEmailAddress) {
      return res.fail(null, { message: "Duplicate Email Address", code: StatusCode.BAD_REQUEST });
    }

    const nextUserNoSeq = await getNextSequence("user_no");
    const userNo = Utils.generateID("USER", branch.branch_abbreviation, nextUserNoSeq);

    const hashedPassword = await hashPassword(password);

    const newUser = await userService.insertUser({
      user_no: userNo,
      branch_id: branchObjectId,
      name,
      surname,
      id_number,
      email_address,
      mobile_number,
      gender,
      password: hashedPassword,
      user_type,
      confirmed: false,
      active: true,
      createdBy: createdObjectId, // TODO: Replace with Authenticated User Id
      updatedBy: updatedByObjectId, // TODO: Replace with Authenticated User Id
    });

    return res.succeed(Utils.sanitizeUser(newUser), {
      message: "Inserted user successfully",
    });
  } catch (err) {
    next(err);
  }
};
