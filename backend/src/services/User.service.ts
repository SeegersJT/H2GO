import dayjs from "dayjs";
import { Types } from "mongoose";
import type { IUser } from "../models/User.model";
import User from "../models/User.model";
import { userRepository } from "../repositories/User.repository";
import { HttpError } from "../utils/HttpError";
import { RegexPatterns } from "../utils/constants/Regex.constant";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { UserType } from "../utils/constants/UserType.constant";
import { BranchService } from "./Branch.service";
import { CountryService } from "./Country.service";
import { AddressService } from "./Address.service";

export class UserService {
  static async getAllUsers() {
    return userRepository.findMany({});
  }

  static async getUserById(id: string) {
    return userRepository.findById(new Types.ObjectId(id));
  }

  static async insertUser(data: Partial<IUser>, actorId: string) {
    if (!data.name || !RegexPatterns.VALIDATE_NAME.test(data.name)) {
      throw new HttpError("Invalid name. Must start with a capital letter and contain only letters", StatusCode.BAD_REQUEST);
    }

    if (!data.surname || !RegexPatterns.VALIDATE_SURNAME.test(data.surname)) {
      throw new HttpError("Invalid surname. Must start with a capital letter and contain only letters", StatusCode.BAD_REQUEST);
    }

    if (!data.gender || !RegexPatterns.VALIDATE_GENDER.test(data.gender)) {
      throw new HttpError('Gender must be either "Male" or "Female"', StatusCode.BAD_REQUEST);
    }

    if (!data.email_address || !RegexPatterns.VALIDATE_EMAIL.test(data.email_address)) {
      throw new HttpError("Invalid email address", StatusCode.BAD_REQUEST);
    }

    if (!data.mobile_number) {
      throw new HttpError("Invalid mobile number", StatusCode.BAD_REQUEST);
    }

    if (!data.id_number) {
      throw new HttpError("Invalid id number", StatusCode.BAD_REQUEST);
    }

    if (!data.branch_id) {
      throw new HttpError("Invalid branch", StatusCode.BAD_REQUEST);
    }

    const branch = await BranchService.getBranchById(data.branch_id.toString());
    if (!branch) {
      throw new HttpError("Invalid or inactive branch", StatusCode.NOT_FOUND);
    }

    const country = await CountryService.getCountryById(branch.country_id.toString());
    if (!country) {
      throw new HttpError("Invalid or inactive country", StatusCode.NOT_FOUND);
    }

    if (country?.country_code === "ZA") {
      if (!RegexPatterns.VALIDATE_MOBILE_SOUTH_AFRICA.test(data.mobile_number)) {
        throw new HttpError("Invalid South African mobile number.", StatusCode.BAD_REQUEST);
      }

      data.mobile_number = (User as any).normalizeMobileNumber(data.mobile_number, Number(country.country_dial_code));

      if (!RegexPatterns.VALIDATE_ID_SOUTH_AFRICA.test(data.id_number)) {
        throw new HttpError("Invalid South African ID number.", StatusCode.BAD_REQUEST);
      }
    }

    const isDuplicateUserIDNumber = await UserService.isDuplicateUserIDNumber(data.id_number);
    if (isDuplicateUserIDNumber) {
      throw new HttpError("Duplicate ID number", StatusCode.CONFLICT);
    }

    const isDuplicateUserEmailAddress = await UserService.isDuplicateUserEmailAddress(data.email_address);
    if (isDuplicateUserEmailAddress) {
      throw new HttpError("Duplicate Email Address", StatusCode.CONFLICT);
    }

    const passwordExpiry = dayjs().add(3, "month").toDate();

    const newUser = {
      ...data,
      password_expiry: passwordExpiry,
      confirmed: false,
      active: true,
    };

    return await userRepository.create(newUser, { actorId: new Types.ObjectId(actorId) });
  }

  static async updateUser(id: string, data: Partial<IUser>, actorId: string) {
    const user = this.getUserById(id);
    if (!user) {
      throw new HttpError("Invalid or inactive user", StatusCode.NOT_FOUND);
    }

    return userRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static async deleteUser(id: string, actorId: string) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new HttpError("Invalid or inactive user", StatusCode.NOT_FOUND);
    }

    return userRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }

  static async isDuplicateUserIDNumber(idNumber: string) {
    const user = await userRepository.findByIdNumber(idNumber);
    return !!user;
  }

  static async isDuplicateUserEmailAddress(email: string) {
    const user = await userRepository.findByEmail(email);
    return !!user;
  }

  static async getAllCustomers() {
    const customers = await userRepository.findMany({ user_type: UserType.CUSTOMER }, { includeAll: true, lean: true });

    const customersWithAddress = await Promise.all(
      customers.map(async (customer: any) => {
        const address = await AddressService.getDefaultAddressForUser(customer._id.toString());
        return { ...customer, address };
      })
    );

    return customersWithAddress;
  }
}
