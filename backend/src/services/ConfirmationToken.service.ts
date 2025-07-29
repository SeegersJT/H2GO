import { IConfirmationToken } from "../models/ConfirmationToken.model";
import { FilterQuery, Types } from "mongoose";
import { Utils } from "../utils/Utils";
import { ConfirmationTokenRepository } from "../repositories/ConfirmationToken.repository";

export class ConfirmationTokenService {
  static getConfirmationTokenByFields = async (params: FilterQuery<IConfirmationToken>): Promise<IConfirmationToken | null> => {
    return await ConfirmationTokenRepository.findConfirmationTokenByFields(params);
  };

  static updateConfirmationToken = async (id: string, updateData: Partial<IConfirmationToken>): Promise<IConfirmationToken | null> => {
    return ConfirmationTokenRepository.updateConfirmationTokenById(id, updateData);
  };

  static insertConfirmationToken = async (confirmationTokenData: FilterQuery<IConfirmationToken>): Promise<IConfirmationToken> => {
    const confirmationToken = Utils.generateSecureConfirmationToken();
    const expiryDate = Utils.getConfirmationTokenExpiry(confirmationTokenData.confirmation_token_type);

    return ConfirmationTokenRepository.insertConfirmationToken({
      confirmation_token: confirmationToken,
      confirmation_token_type: confirmationTokenData.confirmation_token_type,
      confirmation_token_expiry_date: expiryDate,
      user_id: new Types.ObjectId(confirmationTokenData.user_id),
      confirmed: false,
      createdBy: new Types.ObjectId(confirmationTokenData.createdBy),
      updatedBy: new Types.ObjectId(confirmationTokenData.createdBy),
    });
  };
}
