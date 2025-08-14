import type { Model, HydratedDocument, AnyKeys } from "mongoose";
import { Types } from "mongoose";
import UserModel from "../models/User.model"; // adjust if your export is named
import type { IUser } from "../models/User.model"; // adjust if your typings are elsewhere
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type UserDoc = HydratedDocument<IUser>;

export class UserRepository extends GenericRepository<IUser, UserDoc> {
  constructor(model: Model<IUser, any, any, any, UserDoc> = UserModel as any) {
    super(model);
  }

  /** Find by email (email is normalized to lowercase) */
  async findByEmail(email: string, opts?: ReadOptions): Promise<UserDoc | null> {
    const normalized = email.trim().toLowerCase();
    return this.findOne({ email_address: normalized }, opts);
  }

  /** Find by human code (user_no) */
  async findByUserNo(userNo: string, opts?: ReadOptions): Promise<UserDoc | null> {
    return this.findOne({ user_no: userNo }, opts);
  }

  /** Find by government ID number */
  async findByIdNumber(idNumber: string, opts?: ReadOptions): Promise<UserDoc | null> {
    return this.findOne({ id_number: idNumber }, opts);
  }

  /** List active users in a branch (respects includeInactive flag from ReadOptions) */
  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<UserDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  /** Paginate users in a branch with optional search on name/surname/email/user_no */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<UserDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { surname: rx }, { email_address: rx }, { user_no: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  /** Increment failed login attempts */
  async incrementFailedLoginAttempts(userId: Types.ObjectId | string, by = 1, opts?: WriteOptions): Promise<UserDoc | null> {
    return (this as any).model
      .findByIdAndUpdate(userId, { $inc: { failedLoginAttempts: by } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** Reset failed login attempts to 0 */
  async resetFailedLoginAttempts(userId: Types.ObjectId | string, opts?: WriteOptions): Promise<UserDoc | null> {
    return (this as any).model
      .findByIdAndUpdate(userId, { $set: { failedLoginAttempts: 0 } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** Set last login timestamp */
  async setLastLoginAt(userId: Types.ObjectId | string, at: Date = new Date(), opts?: WriteOptions): Promise<UserDoc | null> {
    return (this as any).model.findByIdAndUpdate(userId, { $set: { lastLoginAt: at } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Confirm user (flip confirmed) */
  async confirmUser(userId: Types.ObjectId | string, at: Date = new Date(), opts?: WriteOptions): Promise<UserDoc | null> {
    return (this as any).model
      .findByIdAndUpdate(userId, { $set: { confirmed: true, updatedAt: at } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /**
   * Change password (relies on your model's pre('save') / pre('findOneAndUpdate') hashing hooks).
   * Optionally resets password expiry (default 90 days as per your model).
   */
  async changePassword(
    userId: Types.ObjectId | string,
    newPlainPassword: string,
    opts?: WriteOptions & { resetExpiryDays?: number }
  ): Promise<UserDoc | null> {
    const update: AnyKeys<IUser> = { password: newPlainPassword } as any;
    if (opts?.resetExpiryDays && opts.resetExpiryDays > 0) {
      const d = new Date();
      d.setDate(d.getDate() + opts.resetExpiryDays);
      (update as any).password_expiry = d;
    }
    // Use findByIdAndUpdate to trigger your hashing hook on findOneAndUpdate
    return (this as any).model
      .findByIdAndUpdate(userId, update, {
        new: true,
        session: opts?.session ?? undefined,
      })
      .exec();
  }

  /** Activate/deactivate explicitly (soft delete handled by GenericRepository.deleteById) */
  async setActive(userId: Types.ObjectId | string, active: boolean, opts?: WriteOptions): Promise<UserDoc | null> {
    return (this as any).model.findByIdAndUpdate(userId, { $set: { active } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

// Optional: export a ready-to-use instance
export const userRepository = new UserRepository();
