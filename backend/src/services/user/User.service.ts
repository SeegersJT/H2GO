import { IUser } from '../../models/User.model';
import * as userRepo from '../../repositories/user/User.repository';

export const getAllUsers = async () => {
  return await userRepo.findAllUsers();
};

export const getUserById = async (id: string) => {
  return await userRepo.findUserById(id);
};

export const insertUser = async (data: Partial<IUser>) => {
  return await userRepo.insertUser(data);
};