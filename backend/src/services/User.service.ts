import User, { IUser } from "../models/User.model";
import * as userRepository from "../repositories/User.repository";

export const getAllUsers = async () => {
  return await userRepository.findAllUsers();
};

export const getUserById = async (id: string) => {
  return await userRepository.findUserById(id);
};

export const getUserByEmailAddress = async (email_address: string) => {
  return await userRepository.findUserByEmailAddress(email_address);
};

export const getUserByIDNumber = async (id_number: string) => {
  return await userRepository.findUserByIDNumber(id_number);
};

export const insertUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

export const isDuplicateUserEmailAddress = async (email_address: string) => {
  const user = await getUserByEmailAddress(email_address);

  if (user !== null) {
    return true;
  }

  return false;
};

export const isDuplicateUserIDNumber = async (id_number: string) => {
  const user = await getUserByEmailAddress(id_number);

  if (user !== null) {
    return true;
  }

  return false;
};
