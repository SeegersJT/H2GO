import dayjs from "dayjs";
import { HttpError } from "../utils/HttpError";
import { generateJwtToken, generateRefreshToken, getAccessTokenExpiry, getRefreshTokenExpiry } from "../utils/Jwt.util";
import log from "../utils/Logger";
import { Utils } from "../utils/Utils";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { BranchService } from "./Branch.service";

import { ConfirmationTokenService } from "./ConfirmationToken.service";
import { OneTimePinService } from "./OneTimePin.service";
import { UserService } from "./User.service";
import { RegexPatterns } from "../utils/constants/Regex.constant";
export class AuthService {
  static loginWithEmail = async (email: string, password: string) => {
    const user = await UserService.getUserByEmailAddress(email);

    if (!user || !(await Utils.comparePasswords(password, user.password))) {
      log.warn().auth(`Login failed for email: ${email}`);
      throw new HttpError("Invalid email or password", StatusCode.UNAUTHORIZED);
    }

    const passwordExpired = user.password_expiry && dayjs().isAfter(dayjs(user.password_expiry));

    if (passwordExpired) {
      const confirmationToken = await ConfirmationTokenService.insertConfirmationToken(user.id, ConfirmationTokenType.PASSWORD_RESET, user.id);

      log.info().auth(`Password expired for user [${user.email_address}] (ID: ${user.id})`);

      return {
        confirmation_token: confirmationToken.confirmation_token,
        confirmation_token_type: confirmationToken.confirmation_token_type,
        confirmation_token_expiry_date: confirmationToken.confirmation_token_expiry_date,
      };
    }

    const confirmationToken = await ConfirmationTokenService.insertConfirmationToken(
      user?.id.toString(),
      ConfirmationTokenType.ONE_TIME_PIN,
      user?.createdBy.toString()
    );

    // TODO: SEND COMMUNICATION (COMMUNICATION SERVICE)
    const otp = await OneTimePinService.insertOneTimePin({
      confirmation_token_id: confirmationToken.id,
      createdBy: user.id,
      updatedBy: user.id,
    });

    log.info().auth(`OTP for ${email}: ${otp.one_time_pin}`);

    return {
      confirmation_token: confirmationToken.confirmation_token,
      confirmation_token_type: confirmationToken.confirmation_token_type,
      confirmation_token_expiry_date: confirmationToken.confirmation_token_expiry_date,
    };
  };

  static oneTimePinLogin = async (token: string, otp: string) => {
    const confirmationToken = await ConfirmationTokenService.getConfirmationTokenByFields({
      confirmation_token: token,
    });

    if (!confirmationToken) {
      log.warn().auth(`Invalid token used: ${token}`);
      throw new HttpError("Invalid token", StatusCode.UNAUTHORIZED);
    }

    if (confirmationToken.confirmed) {
      log.warn().auth(`Token already confirmed: ${token}`);
      throw new HttpError("Token already used", StatusCode.BAD_REQUEST);
    }

    if (new Date() > confirmationToken.confirmation_token_expiry_date) {
      log.warn().auth(`Token expired: ${token}`);
      throw new HttpError("Token expired", StatusCode.UNAUTHORIZED);
    }

    const oneTimePin = await OneTimePinService.getOneTimePinByConfirmationTokenId(confirmationToken.id);

    if (!oneTimePin) {
      log.warn().auth(`OTP not found for token: ${token}`);
      throw new HttpError("Invalid OTP", StatusCode.UNAUTHORIZED);
    }

    if (otp !== oneTimePin.one_time_pin) {
      log.warn().auth(`Incorrect OTP for token: ${token}`);
      throw new HttpError("Incorrect OTP", StatusCode.UNAUTHORIZED);
    }

    const user = await UserService.getUserById(confirmationToken.user_id.toString());
    if (!user) {
      log.error().auth(`User not found for confirmationToken: ${token}`);
      throw new HttpError("User does not exist", StatusCode.NOT_FOUND);
    }

    const branch = await BranchService.getBranchById(user.branch_id.toString());
    if (!branch) {
      log.error().auth(`Branch not found for user: ${user._id}`);
      throw new HttpError("Branch does not exist", StatusCode.NOT_FOUND);
    }

    const accessToken = generateJwtToken(user, branch);
    const refreshToken = generateRefreshToken(user);

    confirmationToken.confirmed = true;
    await confirmationToken.save();

    log.success().auth(`Login success for user: ${user.email_address}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_in: getAccessTokenExpiry(),
      refresh_token_expires_in: getRefreshTokenExpiry(),
    };
  };

  static passwordResetLogin = async (token: string, password: string) => {
    const confirmationToken = await ConfirmationTokenService.getConfirmationTokenByFields({
      confirmation_token: token,
    });

    if (!confirmationToken) {
      log.warn().auth(`Invalid token used: ${token}`);
      throw new HttpError("Invalid token", StatusCode.UNAUTHORIZED);
    }

    if (confirmationToken.confirmed) {
      log.warn().auth(`Token already confirmed: ${token}`);
      throw new HttpError("Token already used", StatusCode.BAD_REQUEST);
    }

    if (new Date() > confirmationToken.confirmation_token_expiry_date) {
      log.warn().auth(`Token expired: ${token}`);
      throw new HttpError("Token expired", StatusCode.UNAUTHORIZED);
    }

    if (!RegexPatterns.VALIDATE_PASSWORD.test(password)) {
      log.warn().auth("Password does not meet the required complexity", StatusCode.BAD_REQUEST);
      throw new HttpError("Password must contain 1 upper, 1 lower, 1 digit, 1 special, 8+ chars", StatusCode.BAD_REQUEST);
    }

    let user = await UserService.getUserById(confirmationToken.user_id.toString());
    if (!user) {
      log.error().auth(`User not found for confirmationToken: ${token}`);
      throw new HttpError("User does not exist", StatusCode.NOT_FOUND);
    }

    const hashedPassword = await Utils.hashPassword(password);
    user.password = hashedPassword;
    user.password_expiry = dayjs().add(3, "months").toDate();
    await user.save();

    const branch = await BranchService.getBranchById(user.branch_id.toString());
    if (!branch) {
      log.error().auth(`Branch not found for user: ${user._id}`);
      throw new HttpError("Branch does not exist", StatusCode.NOT_FOUND);
    }

    const accessToken = generateJwtToken(user, branch);
    const refreshToken = generateRefreshToken(user);

    confirmationToken.confirmed = true;
    await confirmationToken.save();

    log.success().auth(`Password reset and login successful for user: ${user.email_address}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_in: getAccessTokenExpiry(),
      refresh_token_expires_in: getRefreshTokenExpiry(),
    };
  };
}
