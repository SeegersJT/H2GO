import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import ConfirmationTokenModel from "../models/ConfirmationToken.model";
import type { IConfirmationToken } from "../models/ConfirmationToken.model";
import { GenericRepository, ReadOptions, WriteOptions } from "./Generic.repository";

export type ConfirmationTokenDoc = HydratedDocument<IConfirmationToken>;

export class ConfirmationTokenRepository extends GenericRepository<IConfirmationToken, ConfirmationTokenDoc> {
  constructor(model: Model<IConfirmationToken, any, any, any, ConfirmationTokenDoc> = ConfirmationTokenModel as any) {
    super(model);
  }

  /** Find active token for user and type */
  async findActiveToken(userId: Types.ObjectId | string, tokenType: string, opts?: ReadOptions): Promise<ConfirmationTokenDoc | null> {
    return this.findOne({ user_id: userId, confirmation_token_type: tokenType, confirmed: false, revoked: false }, opts);
  }

  /** Mark a token confirmed */
  async markConfirmed(tokenId: Types.ObjectId | string, at: Date = new Date(), opts?: WriteOptions) {
    return (this as any).model
      .findByIdAndUpdate(tokenId, { $set: { confirmed: true, confirmed_at: at } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** Revoke a token */
  async revoke(tokenId: Types.ObjectId | string, at: Date = new Date(), opts?: WriteOptions) {
    return (this as any).model
      .findByIdAndUpdate(tokenId, { $set: { revoked: true, revoked_at: at } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }
}

export const confirmationTokenRepository = new ConfirmationTokenRepository();
