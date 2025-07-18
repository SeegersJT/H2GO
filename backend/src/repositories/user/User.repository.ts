import User, { IUser } from '../../models/User.model';

export const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find({}, { password: 0 });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id, { password: 0 });
};

export const insertUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};