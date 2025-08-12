import BaseRepository from "./Base.repository";
import ConfirmationToken from "../models/ConfirmationToken.model";
import { IConfirmationToken, ConfirmationTokenType } from "../types/auth";

class ConfirmationTokenRepository extends BaseRepository<IConfirmationToken> {
  findActiveByToken(token: string) {
    return this.findOne({ token, usedAt: { $exists: false }, expiresAt: { $gt: new Date() } } as any, { lean: true });
  }
  async invalidateActiveOfType(userId: string, type: ConfirmationTokenType) {
    const res = await ConfirmationToken.updateMany(
      { user: userId as any, type, usedAt: { $exists: false } },
      { $set: { expiresAt: new Date() } }
    ).exec();
    return { modifiedCount: res.modifiedCount ?? 0 };
  }
}

export default new ConfirmationTokenRepository(ConfirmationToken);
