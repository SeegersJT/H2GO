import { comparePasswords } from "../utils/Password.util";
import { Utils } from "../utils/Utils";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";

import * as userService from "./User.service";
import * as confirmationTokenService from "./ConfirmationToken.service";

export const loginWithEmail = async (email: string, password: string) => {
  const user = await userService.getUserByEmailAddress(email);

  if (!user || !(await comparePasswords(password, user.password))) {
    throw new Error("Invalid email or password.");
  }

  const confirmationToken = await confirmationTokenService.insertConfirmationToken(
    user?.id.toString(),
    ConfirmationTokenType.ONE_TIME_PIN,
    user?.createdBy.toString(),
    user?.updatedBy.toString()
  );

  // TODO:  INSERT OTP INTO DB AND SEND COMMUNICATION
  const otp = Utils.generateSecureConfirmationToken(1, 6);

  console.log(`OTP for ${email}: ${otp}`);

  return {
    confirmation_token: confirmationToken.confirmation_token,
    confirmation_token_type: confirmationToken.confirmation_token_type,
    confirmation_token_expiry_date: confirmationToken.confirmation_token_expiry_date,
  };
};

export const verifyOtpAndLogin = async (token: string, otp: string) => {
  //   const confirmationToken = await confirmationTokenRepository.getConfirmationTokenByFields({
  //     confirmation_token: token,
  //   });
  //   if (!confirmationToken) throw new Error("Invalid token.");
  //   if (confirmationToken.confirmed) throw new Error("Token already used.");
  //   if (new Date() > confirmationToken.confirmation_token_expiry_date)
  //     throw new Error("Token expired.");
  //   // Normally you should verify that the OTP was stored & matches
  //   // Here for now just accept any valid token
  //   confirmationToken.confirmed = true;
  //   await confirmationToken.save();
  //   const user = await userRepository.getUserById(confirmationToken.user_id.toString());
  //   const accessToken = generateJwtToken(user);
  //   const refreshToken = generateRefreshToken(user);
  //   return {
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //     expires_in: "1h", // or calculated expiry
  //   };
};
