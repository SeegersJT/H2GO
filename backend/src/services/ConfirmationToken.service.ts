import { IConfirmationToken } from "../models/ConfirmationToken.model";
import { FilterQuery, Types } from "mongoose";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { Utils } from "../utils/Utils";
import { ConfirmationTokenRepository } from "../repositories/ConfirmationToken.repository";

export class ConfirmationTokenService {
  static getConfirmationTokenByFields = async (params: FilterQuery<IConfirmationToken>) => {
    return await ConfirmationTokenRepository.findConfirmationTokenByFields(params);
  };

  static updateConfirmationToken = async (id: string, updateData: Partial<IConfirmationToken>): Promise<IConfirmationToken | null> => {
    return ConfirmationTokenRepository.updateConfirmationTokenById(id, updateData);
  };

  static insertConfirmationToken = async (
    userId: string,
    confirmationTokenType: ConfirmationTokenType,
    createdBy: string
  ): Promise<IConfirmationToken> => {
    const confirmationToken = Utils.generateSecureConfirmationToken();
    const expiryDate = Utils.getConfirmationTokenExpiry(confirmationTokenType);

    return ConfirmationTokenRepository.insertConfirmationToken({
      confirmation_token: confirmationToken,
      confirmation_token_type: confirmationTokenType,
      confirmation_token_expiry_date: expiryDate,
      user_id: new Types.ObjectId(userId),
      confirmed: false,
      createdBy: new Types.ObjectId(createdBy),
      updatedBy: new Types.ObjectId(createdBy),
    });
  };
}
