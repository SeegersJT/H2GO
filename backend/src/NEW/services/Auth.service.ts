import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import log from "../utils/Logger";
import { Utils } from "../utils/Utils";
import { HttpError } from "../utils/HttpError";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { generateJwtToken, generateRefreshToken, getAccessTokenExpiry, getRefreshTokenExpiry } from "../utils/Jwt.util";
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
    const unconfirmedUser = !user.confirmed;

    let confirmationTokenType: ConfirmationTokenType;

    switch (true) {
      case passwordExpired:
        confirmationTokenType = ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN;
        break;
      case unconfirmedUser:
        confirmationTokenType = ConfirmationTokenType.OTP_CONFIRM_LOGIN_TOKEN;
        break;
      default:
        confirmationTokenType = ConfirmationTokenType.OTP_LOGIN_TOKEN;
    }

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
    return await ConfirmationTokenService.validateConfirmationToken(confirmationToken);
  };

  static oneTimePin = async (confirmationToken: string, oneTimePin: string): Promise<[any, string]> => {
    const confirmationTokenEntity = await ConfirmationTokenService.validateConfirmationToken(confirmationToken);

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
      confirmationTokenEntity.confirmation_token_type === ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN ||
      confirmationTokenEntity.confirmation_token_type === ConfirmationTokenType.OTP_CONFIRM_LOGIN_TOKEN
    ) {
      const passwordResetConfirmationTokenEntity = await ConfirmationTokenService.insertConfirmationToken({
        confirmation_token_type: ConfirmationTokenType.PASSWORD_RESET_TOKEN,
        user_id: user.id,
        createdBy: user.id,
      });

      let customMessage: string;

      switch (confirmationTokenEntity.confirmation_token_type) {
        case ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN:
          customMessage = "OTP verified. Your password has expired, reset is required.";
          break;

        case ConfirmationTokenType.OTP_CONFIRM_LOGIN_TOKEN:
          customMessage = "OTP verified. Your account is not confirmed. Reset your password.";
          break;

        default:
          customMessage = "OTP verified. Reset your password.";
          break;
      }

      confirmationTokenEntity.confirmed = true;
      await confirmationTokenEntity.save();

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

  static passwordForgot = async (email: string) => {
    const user = await UserService.getUserByEmailAddress(email);

    if (!user) {
      log.warn().auth(`Invalid email: ${email}`);
      throw new HttpError("Invalid email", StatusCode.UNAUTHORIZED);
    }

    const confirmationTokenEntity = await ConfirmationTokenService.insertConfirmationToken({
      confirmation_token_type: ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN,
      user_id: user.id,
      createdBy: user.id,
    });

    log.info().auth(`Generated ${ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN} for user [${user.email_address}]`);

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

  static passwordReset = async (confirmationToken: string, password: string, confirmPassword: string) => {
    const confirmationTokenEntity = await ConfirmationTokenService.validateConfirmationToken(confirmationToken);

    if (password !== confirmPassword) {
      log.warn().auth("Passwords do not match", StatusCode.BAD_REQUEST);
      throw new HttpError("Passwords do not match", StatusCode.BAD_REQUEST);
    }

    if (!RegexPatterns.VALIDATE_PASSWORD.test(password)) {
      log.warn().auth("Password does not meet the required complexity", StatusCode.BAD_REQUEST);
      throw new HttpError("Password must contain 1 upper, 1 lower, 1 digit, 1 special, 8+ chars", StatusCode.BAD_REQUEST);
    }

    let user = await UserService.getUserById(confirmationTokenEntity.user_id.toString());
    if (!user) {
      log.error().auth(`User not found for confirmationToken: ${confirmationToken}`);
      throw new HttpError("User does not exist", StatusCode.NOT_FOUND);
    }

    const hashedPassword = await Utils.hashPassword(password);

    user.password = hashedPassword;
    user.password_expiry = dayjs().add(3, "months").toDate();
    user.confirmed = true;

    await user.save();

    const branch = await BranchService.getBranchById(user.branch_id.toString());
    if (!branch) {
      log.error().auth(`Branch not found for user: ${user._id}`);
      throw new HttpError("Branch does not exist", StatusCode.NOT_FOUND);
    }

    const accessToken = generateJwtToken(user, branch);
    const refreshToken = generateRefreshToken(user);

    confirmationTokenEntity.confirmed = true;
    await confirmationTokenEntity.save();

    log.success().auth(`Password reset and login successful for user: ${user.email_address}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_in: getAccessTokenExpiry(),
      refresh_token_expires_in: getRefreshTokenExpiry(),
    };
  };

  static refreshToken = async (refreshToken: string) => {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN!) as { id: string };

    const user = await UserService.getUserById(payload.id);

    if (!user) {
      log.warn().auth("User not found");
      throw new HttpError("User not found", StatusCode.UNAUTHORIZED);
    }

    const branch = await BranchService.getBranchById(user.branch_id.toString());

    if (!branch) {
      log.warn().auth("Branch not found");
      throw new HttpError("Branch not found", StatusCode.UNAUTHORIZED);
    }

    const newAccessToken = generateJwtToken(user, branch);

    return {
      accessToken: newAccessToken,
    };
  };
}
