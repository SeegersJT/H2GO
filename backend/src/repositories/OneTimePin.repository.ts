import OneTimePin, { IOneTimePin } from "../models/OneTimePin.model";

export const insertOneTimePin = async (oneTimePindata: Partial<IOneTimePin>): Promise<IOneTimePin> => {
  return await OneTimePin.create(oneTimePindata);
};

export const getOneTimePinByConfirmationTokenId = async (confirmationTokenId: string): Promise<IOneTimePin | null> => {
  return await OneTimePin.findOne({ confirmation_token_id: confirmationTokenId });
};
