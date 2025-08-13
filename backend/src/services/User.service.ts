import { Types } from "mongoose";
import { userRepository } from "../repositories/User.repository";
import type { IUser } from "../models/User.model";

export class UserService {
  static async getAllUsers() {
    return userRepository.findMany({});
  }

  static async getUserById(id: string) {
    return userRepository.findById(new Types.ObjectId(id));
  }

  static async insertUser(data: Partial<IUser>) {
    return userRepository.create(data);
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
