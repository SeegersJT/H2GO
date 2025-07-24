import { FilterQuery } from "mongoose";
import ConfirmationToken, { IConfirmationToken } from "../models/ConfirmationToken.model";

export class ConfirmationTokenRepository {
  static findConfirmationTokenByFields = async (params: FilterQuery<IConfirmationToken>): Promise<IConfirmationToken | null> => {
    return await ConfirmationToken.findOne(params);
  };

  static updateConfirmationTokenById = async (id: string, updateData: Partial<IConfirmationToken>): Promise<IConfirmationToken | null> => {
    return ConfirmationToken.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      upsert: false,
    });
  };

  static insertConfirmationToken = async (confirmationTokenData: Partial<IConfirmationToken>): Promise<IConfirmationToken> => {
    return await ConfirmationToken.create(confirmationTokenData);
  };
}
