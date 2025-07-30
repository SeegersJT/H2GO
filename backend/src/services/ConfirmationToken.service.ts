import { IConfirmationToken } from "../models/ConfirmationToken.model";
import { FilterQuery, Types } from "mongoose";
import { Utils } from "../utils/Utils";
import { ConfirmationTokenRepository } from "../repositories/ConfirmationToken.repository";
import log from "../utils/Logger";
import { HttpError } from "../utils/HttpError";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class ConfirmationTokenService {
  static getConfirmationTokenByToken = async (confirmationToken: string): Promise<IConfirmationToken> => {
    const confirmationTokenEntity = await this.getConfirmationTokenByFields({
      confirmation_token: confirmationToken,
    });

    if (!confirmationTokenEntity) {
      log.warn().auth("Token not found or invalid");
      throw new HttpError("Token not found or invalid", StatusCode.UNAUTHORIZED);
    }

    return confirmationTokenEntity;
  };

  static validateConfirmationToken = async (confirmationToken: string): Promise<IConfirmationToken> => {
    const confirmationTokenEntity = await ConfirmationTokenService.getConfirmationTokenByFields({
      confirmation_token: confirmationToken,
    });

    if (!confirmationTokenEntity) {
      log.warn().auth(`Invalid token used: ${confirmationToken}`);
      throw new HttpError("Invalid token", StatusCode.UNAUTHORIZED);
    }

    if (confirmationTokenEntity.confirmed) {
      log.warn().auth(`Token already confirmed: ${confirmationToken}`);
      throw new HttpError("Token already used", StatusCode.BAD_REQUEST);
    }

    if (new Date() > confirmationTokenEntity.confirmation_token_expiry_date) {
      log.warn().auth(`Token expired: ${confirmationToken}`);
      throw new HttpError("Token expired", StatusCode.UNAUTHORIZED);
    }

    return confirmationTokenEntity;
  };

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
