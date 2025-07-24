import User, { IUser } from "../models/User.model";

export class UserRepository {
  static findAllUsers = async (): Promise<IUser[]> => {
    return await User.find({}, { password: 0 });
  };

  static findUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id, { password: 0 });
  };

  static findUserByEmailAddress = async (email_address: string): Promise<IUser | null> => {
    return await User.findOne({ email_address });
  };

  static findUserByIDNumber = async (id_number: string): Promise<IUser | null> => {
    return await User.findOne({ id_number });
  };

  static insertUser = async (userData: Partial<IUser>): Promise<IUser> => {
    return await User.create(userData);
  };
}
