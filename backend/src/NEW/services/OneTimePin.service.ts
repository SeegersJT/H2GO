import { IOneTimePin } from "../models/OneTimePin.model";
import { OneTimePinRepository } from "../repositories/OneTimePin.repository";
import { Utils } from "../utils/Utils";
import { FilterQuery } from "mongoose";

export class OneTimePinService {
  static insertOneTimePin = async (oneTimePinData: FilterQuery<IOneTimePin>): Promise<IOneTimePin> => {
    const generatedOtp = Utils.generateSecureConfirmationToken(1, 6);

    return OneTimePinRepository.insertOneTimePin({
      confirmation_token_id: oneTimePinData.confirmation_token_id,
      one_time_pin: generatedOtp,
      createdBy: oneTimePinData.createdBy,
      updatedBy: oneTimePinData.updatedBy,
    });
  };

  static getOneTimePinByConfirmationTokenId = async (confirmationTokenId: string): Promise<IOneTimePin | null> => {
    return await OneTimePinRepository.getOneTimePinByConfirmationTokenId(confirmationTokenId);
  };
}
