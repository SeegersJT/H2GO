import { IUser } from "../models/User.model";
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
  return await userRepository.insertUser(userData);
};

export const isDuplicateUserEmailAddress = async (email_address: string) => {
  const user = await getUserByEmailAddress(email_address);

  return user !== null;
};

export const isDuplicateUserIDNumber = async (id_number: string) => {
  const user = await getUserByIDNumber(id_number);

  return user !== null;
};
