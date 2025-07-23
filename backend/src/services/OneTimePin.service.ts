import { IOneTimePin } from "../models/OneTimePin.model";
import { Utils } from "../utils/Utils";
import { FilterQuery } from "mongoose";

import * as oneTimePinRepository from "../repositories/OneTimePin.repository";

export const insertOneTimePin = async (oneTimePinData: FilterQuery<IOneTimePin>): Promise<IOneTimePin> => {
  const generatedOtp = Utils.generateSecureConfirmationToken(1, 6);

  return oneTimePinRepository.insertOneTimePin({
    confirmation_token_id: oneTimePinData.confirmation_token_id,
    one_time_pin: generatedOtp,
    createdBy: oneTimePinData.createdBy,
    updatedBy: oneTimePinData.updatedBy,
  });
};

export const getOneTimePinByConfirmationTokenId = async (confirmationTokenId: string): Promise<IOneTimePin | null> => {
  return await oneTimePinRepository.getOneTimePinByConfirmationTokenId(confirmationTokenId);
};
