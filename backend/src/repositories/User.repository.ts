import User, { IUser } from "../models/User.model";

export const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find({}, { password: 0 });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id, { password: 0 });
};

export const findUserByEmailAddress = async (email_address: string): Promise<IUser | null> => {
  return await User.findOne({ email_address });
};

export const findUserByIDNumber = async (id_number: string): Promise<IUser | null> => {
  return await User.findOne({ id_number });
};

export const insertUser = async (userData: Partial<IUser>): Promise<IUser> => {
  return await User.create(userData);
};
