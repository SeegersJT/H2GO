import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import dayjs from "dayjs";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { RegexPatterns } from "../utils/constants/Regex.constant";
import { BranchService } from "../services/Branch.service";
import { CountryService } from "../services/Country.service";
import { UserService } from "../services/User.service";
import User from "../models/User.model";

export class UserController {
  static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAllUsers();

      return res.success(users, {
        message: "Retrieved users successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);

      return res.success(user, {
        message: "Retrieved user successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static insertUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, name, surname, id_number, email_address, mobile_number, gender, password, user_type } = req.body;

      if (!branch_id || !name || !surname || !id_number || !email_address || !mobile_number || !password || !user_type) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const branchObjectId = new Types.ObjectId(branch_id);
      const createdObjectId = new Types.ObjectId(authenticatedUser.id);
      const updatedByObjectId = new Types.ObjectId(authenticatedUser.id);

      if (!RegexPatterns.VALIDATE_NAME.test(name)) {
        return res.error(null, {
          message: "Invalid name. Must start with a capital letter and contain only letters.",
        });
      }

      if (!RegexPatterns.VALIDATE_SURNAME.test(surname)) {
        return res.error(null, {
          message: "Invalid surname. Must start with a capital letter and contain only letters.",
        });
      }

      if (!RegexPatterns.VALIDATE_GENDER.test(gender)) {
        return res.error(null, { message: 'Gender must be either "Male" or "Female"' });
      }

      if (!RegexPatterns.VALIDATE_EMAIL.test(email_address)) {
        return res.error(null, {
          message: "Invalid email address.",
        });
      }

      const branch = await BranchService.getBranchById(branch_id);
      if (!branch) {
        return res.error(null, {
          message: "Invalid or inactive branch",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const country = await CountryService.getCountryById(branch.country_id.toString());
      if (!country) {
        return res.error(null, {
          message: "Invalid or inactive country",
          code: StatusCode.BAD_REQUEST,
        });
      }

      if (country?.country_code === "ZA") {
        if (!RegexPatterns.VALIDATE_MOBILE_SOUTH_AFRICA.test(mobile_number)) {
          return res.error(null, { message: "Invalid South African mobile number." });
        }

        mobile_number = (User as any).normalizeMobileNumber(mobile_number, Number(country.country_dial_code));

        if (!RegexPatterns.VALIDATE_ID_SOUTH_AFRICA.test(id_number)) {
          return res.error(null, { message: "Invalid South African ID number." });
        }
      }

      const isDuplicateUserIDNumber = await UserService.isDuplicateUserIDNumber(id_number);
      if (isDuplicateUserIDNumber) {
        return res.error(null, { message: "Duplicate ID number", code: StatusCode.BAD_REQUEST });
      }

      const isDuplicateUserEmailAddress = await UserService.isDuplicateUserEmailAddress(email_address);
      if (isDuplicateUserEmailAddress) {
        return res.error(null, { message: "Duplicate Email Address", code: StatusCode.BAD_REQUEST });
      }

      const passwordExpiry = dayjs().add(3, "month").toDate();

      const newUser = await UserService.insertUser({
        branch_id: branchObjectId,
        name,
        surname,
        id_number,
        email_address,
        mobile_number,
        gender,
        password: password,
        password_expiry: passwordExpiry,
        user_type,
        confirmed: false,
        active: true,
        createdBy: createdObjectId,
        updatedBy: updatedByObjectId,
      });

      return res.success(newUser.toJSON(), {
        message: "Inserted user successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      if (updateData.branch_id) {
        updateData.branch_id = new Types.ObjectId(updateData.branch_id);
      }
      updateData.updatedBy = new Types.ObjectId(authenticatedUser.id);

      const updatedUser = await UserService.updateUser(userId, updateData);

      return res.success(updatedUser, {
        message: "Updated user successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      const deleted = await UserService.deleteUser(userId);

      if (!deleted) {
        return res.error(null, { message: "User not found", code: StatusCode.NOT_FOUND });
      }

      return res.success(null, { message: "Deleted user successfully" });
    } catch (err) {
      next(err);
    }
  };
}
