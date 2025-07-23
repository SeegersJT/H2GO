import { IConfirmationToken } from "../models/ConfirmationToken.model";
import { FilterQuery, Types } from "mongoose";
import {
  ConfirmationTokenExpiryMap,
  ConfirmationTokenType,
} from "../utils/constants/ConfirmationToken.constant";
import dayjs from "dayjs";
import { Utils } from "../utils/Utils";

import * as confirmationTokenRepository from "../repositories/ConfirmationToken.repository";

export const getConfirmationTokenByFields = async (params: FilterQuery<IConfirmationToken>) => {
  return await confirmationTokenRepository.findConfirmationTokenByFields(params);
};

export const updateConfirmationToken = async (
  id: string,
  updateData: Partial<IConfirmationToken>
): Promise<IConfirmationToken | null> => {
  return confirmationTokenRepository.updateConfirmationTokenById(id, updateData);
};

export const insertConfirmationToken = async (
  userId: string,
  confirmationTokenType: ConfirmationTokenType,
  createdBy: string,
  updatedBy: string
): Promise<IConfirmationToken> => {
  const confirmationToken = Utils.generateSecureConfirmationToken();
  const expiryDate = Utils.getConfirmationTokenExpiry(confirmationTokenType);

  return confirmationTokenRepository.insertConfirmationToken({
    confirmation_token: confirmationToken,
    confirmation_token_type: confirmationTokenType,
    confirmation_token_expiry_date: expiryDate,
    user_id: new Types.ObjectId(userId),
    confirmed: false,
    createdBy: new Types.ObjectId(createdBy), // TODO: Replace with Authenticated User Id
    updatedBy: new Types.ObjectId(updatedBy), // TODO: Replace with Authenticated User Id
  });
};
