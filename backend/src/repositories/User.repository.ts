import BaseRepository from "./Base.repository";
import User from "../models/User.model";
import { IUser } from "../types/auth";

class UserRepository extends BaseRepository<IUser> {
  findByEmail(email: string) {
    return this.findOne({ email: email.toLowerCase() } as any);
  }
  findByPhone(phone: string) {
    return this.findOne({ phone } as any);
  }
}

export default new UserRepository(User);
