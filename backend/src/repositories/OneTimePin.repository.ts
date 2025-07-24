import OneTimePin, { IOneTimePin } from "../models/OneTimePin.model";

export class OneTimePinRepository {
  static insertOneTimePin = async (oneTimePindata: Partial<IOneTimePin>): Promise<IOneTimePin> => {
    return await OneTimePin.create(oneTimePindata);
  };

  static getOneTimePinByConfirmationTokenId = async (confirmationTokenId: string): Promise<IOneTimePin | null> => {
    return await OneTimePin.findOne({ confirmation_token_id: confirmationTokenId });
  };
}
