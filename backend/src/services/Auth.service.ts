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
  static login = async (email: string, password: string) => {
    const user = await UserService.getUserByEmailAddress(email);

    if (!user || !(await Utils.comparePasswords(password, user.password))) {
      log.warn().auth(`Invalid email or password for user: ${email}`);
      throw new HttpError("Invalid email or password", StatusCode.UNAUTHORIZED);
    }

    const passwordExpired = user.password_expiry && dayjs().isAfter(dayjs(user.password_expiry));

    const confirmationTokenType: ConfirmationTokenType = passwordExpired
      ? ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN
      : ConfirmationTokenType.OTP_LOGIN_TOKEN;

    const confirmationTokenEntity = await ConfirmationTokenService.insertConfirmationToken({
      confirmation_token_type: confirmationTokenType,
      user_id: user.id,
      createdBy: user.id,
    });

    log.info().auth(`Generated ${confirmationTokenType} for user [${user.email_address}]`);

    const oneTimePin = await OneTimePinService.insertOneTimePin({
      confirmation_token_id: confirmationTokenEntity.id,
      createdBy: user.id,
      updatedBy: user.id,
    });

    log.info().auth(`OTP for ${email}: ${oneTimePin.one_time_pin}`);

    return {
      confirmation_token: confirmationTokenEntity.confirmation_token,
      confirmation_token_type: confirmationTokenEntity.confirmation_token_type,
      confirmation_token_expiry_date: confirmationTokenEntity.confirmation_token_expiry_date,
    };
  };

  static validateConfirmationToken = async (confirmationToken: string) => {
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

  static oneTimePin = async (confirmationToken: string, oneTimePin: string): Promise<[any, string]> => {
    const confirmationTokenEntity = await this.validateConfirmationToken(confirmationToken);

    const oneTimePinEntity = await OneTimePinService.getOneTimePinByConfirmationTokenId(confirmationTokenEntity.id);

    if (!oneTimePinEntity) {
      log.warn().auth(`OTP not found for token: ${confirmationToken}`);
      throw new HttpError("Invalid OTP", StatusCode.UNAUTHORIZED);
    }

    if (oneTimePin !== oneTimePinEntity.one_time_pin) {
      log.warn().auth(`Incorrect OTP for token: ${confirmationToken}`);
      throw new HttpError("Incorrect OTP", StatusCode.UNAUTHORIZED);
    }

    const user = await UserService.getUserById(confirmationTokenEntity.user_id.toString());

    if (!user) {
      log.error().auth(`User not found for confirmationToken: ${confirmationToken}`);
      throw new HttpError("User does not exist", StatusCode.NOT_FOUND);
    }

    if (confirmationTokenEntity.confirmation_token_type === ConfirmationTokenType.OTP_LOGIN_TOKEN) {
      const branch = await BranchService.getBranchById(user.branch_id.toString());

      if (!branch) {
        log.error().auth(`Branch not found for user: ${user._id}`);
        throw new HttpError("Branch does not exist", StatusCode.NOT_FOUND);
      }

      const accessToken = generateJwtToken(user, branch);
      const refreshToken = generateRefreshToken(user);

      confirmationTokenEntity.confirmed = true;
      await confirmationTokenEntity.save(); // TODO: Create repository .save()

      log.success().auth(`Login success for user: ${user.email_address}`);

      return [
        {
          access_token: accessToken,
          refresh_token: refreshToken,
          access_token_expires_in: getAccessTokenExpiry(),
          refresh_token_expires_in: getRefreshTokenExpiry(),
        },
        "Login successful",
      ];
    }

    if (
      confirmationTokenEntity.confirmation_token_type === ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN ||
      confirmationTokenEntity.confirmation_token_type === ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN
    ) {
      const passwordResetConfirmationTokenEntity = await ConfirmationTokenService.insertConfirmationToken({
        confirmation_token_type: ConfirmationTokenType.PASSWORD_RESET_TOKEN,
        user_id: user.id,
        createdBy: user.id,
      });

      const customMessage =
        confirmationTokenEntity.confirmation_token_type === ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN
          ? "OTP verified. Your password has expired, reset is required."
          : "OTP verified. Reset your password.";

      return [
        {
          confirmation_token: passwordResetConfirmationTokenEntity.confirmation_token,
          confirmation_token_type: passwordResetConfirmationTokenEntity.confirmation_token_type,
          confirmation_token_expiry_date: passwordResetConfirmationTokenEntity.confirmation_token_expiry_date,
        },
        customMessage,
      ];
    }

    throw new HttpError("Unsupported confirmation token type", StatusCode.BAD_REQUEST);
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
