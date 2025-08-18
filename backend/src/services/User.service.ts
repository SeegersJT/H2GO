import { Types } from "mongoose";
import { userRepository } from "../repositories/User.repository";
import type { IUser } from "../models/User.model";
import { RegexPatterns } from "../utils/constants/Regex.constant";
import { BranchService } from "./Branch.service";
import { CountryService } from "./Country.service";
import User from "../models/User.model";
import dayjs from "dayjs";

export class UserService {
  static async getAllUsers() {
    return userRepository.findMany({});
  }

  static async getUserById(id: string) {
    return userRepository.findById(new Types.ObjectId(id));
  }

  static async insertUser(data: Partial<IUser>, actorId: string) {
    if (!data.name || !RegexPatterns.VALIDATE_NAME.test(data.name)) {
      throw new Error("Invalid name. Must start with a capital letter and contain only letters");
    }

    if (!data.surname || !RegexPatterns.VALIDATE_SURNAME.test(data.surname)) {
      throw new Error("Invalid surname. Must start with a capital letter and contain only letters");
    }

    if (!data.gender || !RegexPatterns.VALIDATE_GENDER.test(data.gender)) {
      throw new Error('Gender must be either "Male" or "Female"');
    }

    if (!data.email_address || !RegexPatterns.VALIDATE_EMAIL.test(data.email_address)) {
      throw new Error("Invalid email address");
    }

    if (!data.mobile_number) {
      throw new Error("Invalid mobile number");
    }

    if (!data.id_number) {
      throw new Error("Invalid id number");
    }

    if (!data.branch_id) {
      throw new Error("Invalid branch");
    }

    const branch = await BranchService.getBranchById(data.branch_id.toString());
    if (!branch) {
      throw new Error("Invalid or inactive branch");
    }

    const country = await CountryService.getCountryById(branch.country_id.toString());
    if (!country) {
      throw new Error("Invalid or inactive country");
    }

    if (country?.country_code === "ZA") {
      if (!RegexPatterns.VALIDATE_MOBILE_SOUTH_AFRICA.test(data.mobile_number)) {
        throw new Error("Invalid South African mobile number.");
      }

      data.mobile_number = (User as any).normalizeMobileNumber(data.mobile_number, Number(country.country_dial_code));

      if (!RegexPatterns.VALIDATE_ID_SOUTH_AFRICA.test(data.id_number)) {
        throw new Error("Invalid South African ID number.");
      }
    }

    const isDuplicateUserIDNumber = await UserService.isDuplicateUserIDNumber(data.id_number);
    if (isDuplicateUserIDNumber) {
      throw new Error("Duplicate ID number");
    }

    const isDuplicateUserEmailAddress = await UserService.isDuplicateUserEmailAddress(data.email_address);
    if (isDuplicateUserEmailAddress) {
      throw new Error("Duplicate Email Address");
    }

    const passwordExpiry = dayjs().add(3, "month").toDate();

    const newUser = {
      ...data,
      password_expiry: passwordExpiry,
      confirmed: false,
      active: true,
    };

    return await userRepository.create(newUser, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async updateUser(id: string, data: Partial<IUser>, actorId: string) {
    const user = this.getUserById(id);
    if (!user) {
      throw new Error("Invalid or inactive user");
    }

    return userRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async deleteUser(id: string, actorId: string) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("Invalid or inactive user");
    }

    return userRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async isDuplicateUserIDNumber(idNumber: string) {
    const user = await userRepository.findByIdNumber(idNumber);
    return !!user;
  }

  static async isDuplicateUserEmailAddress(email: string) {
    const user = await userRepository.findByEmail(email);
    return !!user;
  }
}
