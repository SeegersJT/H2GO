import { IUser } from "../models/User.model";

import { UserRepository } from "../repositories/User.repository";
export class UserService {
  static getAllUsers = async () => {
    return await UserRepository.findAllUsers();
  };

  static getUserById = async (id: string) => {
    return await UserRepository.findUserById(id);
  };

  static getUserByEmailAddress = async (email_address: string) => {
    return await UserRepository.findUserByEmailAddress(email_address);
  };

  static getUserByIDNumber = async (id_number: string) => {
    return await UserRepository.findUserByIDNumber(id_number);
  };

  static insertUser = async (userData: Partial<IUser>): Promise<IUser> => {
    return await UserRepository.insertUser(userData);
  };

  static isDuplicateUserEmailAddress = async (email_address: string) => {
    const user = await this.getUserByEmailAddress(email_address);

    return user !== null;
  };

  static isDuplicateUserIDNumber = async (id_number: string) => {
    const user = await this.getUserByIDNumber(id_number);

    return user !== null;
  };
}
