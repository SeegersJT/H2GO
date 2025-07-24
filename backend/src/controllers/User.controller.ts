import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Utils } from "../utils/Utils";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { RegexPatterns } from "../utils/constants/Regex.constant";
import { UserService } from "../services/User.service";
import { BranchService } from "../services/Branch.service";
import { CountryService } from "../services/Country.service";
import { CounterService } from "../services/Counter.service";
import dayjs from "dayjs";

export class UserController {
  static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAllUsers();

      return res.succeed(users, {
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

      return res.succeed(user, {
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
        return res.fail(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.fail(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const branchObjectId = new Types.ObjectId(branch_id);
      const createdObjectId = new Types.ObjectId(authenticatedUser.id);
      const updatedByObjectId = new Types.ObjectId(authenticatedUser.id);

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
      const branch = await BranchService.getBranchById(branch_id);
      if (!branch) {
        return res.fail(null, {
          message: "Invalid or inactive branch",
          code: StatusCode.BAD_REQUEST,
        });
      }

      // COUNTRY VALIDATION
      const country = await CountryService.getCountryById(branch.country_id.toString());
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

      const isDuplicateUserIDNumber = await UserService.isDuplicateUserIDNumber(id_number);
      if (isDuplicateUserIDNumber) {
        return res.fail(null, { message: "Duplicate ID number", code: StatusCode.BAD_REQUEST });
      }

      const isDuplicateUserEmailAddress = await UserService.isDuplicateUserEmailAddress(email_address);
      if (isDuplicateUserEmailAddress) {
        return res.fail(null, { message: "Duplicate Email Address", code: StatusCode.BAD_REQUEST });
      }

      const nextUserNoSeq = await CounterService.getNextSequence("user_no");
      const userNo = Utils.generateID("USER", branch.branch_abbreviation, nextUserNoSeq);

      const hashedPassword = await Utils.hashPassword(password);
      const passwordExpiry = dayjs().add(3, "month").toDate();

      const newUser = await UserService.insertUser({
        user_no: userNo,
        branch_id: branchObjectId,
        name,
        surname,
        id_number,
        email_address,
        mobile_number,
        gender,
        password: hashedPassword,
        password_expiry: passwordExpiry,
        user_type,
        confirmed: false,
        active: true,
        createdBy: createdObjectId,
        updatedBy: updatedByObjectId,
      });

      return res.succeed(Utils.sanitizeUser(newUser), {
        message: "Inserted user successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
