import { FilterQuery } from "mongoose";
import ConfirmationToken, { IConfirmationToken } from "../models/ConfirmationToken.model";

export const findConfirmationTokenByFields = async (
  params: FilterQuery<IConfirmationToken>
): Promise<IConfirmationToken | null> => {
  return await ConfirmationToken.findOne(params);
};

export const updateConfirmationTokenById = async (
  id: string,
  updateData: Partial<IConfirmationToken>
): Promise<IConfirmationToken | null> => {
  return ConfirmationToken.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    upsert: false,
  });
};

export const insertConfirmationToken = async (
  confirmationTokenData: Partial<IConfirmationToken>
): Promise<IConfirmationToken> => {
  return await ConfirmationToken.create(confirmationTokenData);
};
