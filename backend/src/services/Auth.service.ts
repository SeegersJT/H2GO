import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import ConfirmationToken from "../models/ConfirmationToken.model";
import { branchRepository } from "../repositories/Branch.repository";
import { confirmationTokenRepository } from "../repositories/ConfirmationToken.repository";
import { userRepository } from "../repositories/User.repository";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { HttpError } from "../utils/HttpError";
import { generateJwtToken, generateRefreshToken, getAccessTokenExpiry, getRefreshTokenExpiry } from "../utils/Jwt.util";
import { ConfirmationTokenService } from "./ConfirmationToken.service";
import { CommunicationService } from "./Communication.service";
import { communicationTemplateRepository } from "../repositories/CommunicationTemplate.repository";
import { CommunicationType } from "../utils/constants/Communication.constant";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email, { projection: "+password" });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const match = await user.comparePassword(password);
    if (!match) {
      throw new Error("Invalid credentials");
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

    const token = (ConfirmationToken as any).generateToken();
    const otp = (ConfirmationToken as any).generateOtp();

    const tokenDoc = await confirmationTokenRepository.create({
      user_id: user._id as any,
      confirmation_token: token,
      confirmation_token_type: confirmationTokenType,
      confirmation_token_expiry_date: (ConfirmationToken as any).getExpiryDate(confirmationTokenType),
      createdBy: new Types.ObjectId(user.id),
      updatedBy: new Types.ObjectId(user.id),
    });

    await tokenDoc.setOtp(otp);
    await tokenDoc.save();

    const otpCommunicationTemplate = await communicationTemplateRepository.findOne({ type: CommunicationType.ONE_TIME_PIN });
    if (!otpCommunicationTemplate) {
      throw new Error("Invalid or inactive template");
    }

    const branch = await branchRepository.findById(user.branch_id);
    if (!branch) {
      throw new Error("Invalid or inactive branch");
    }

    const templateParameters = {
      otp: otp,
      branch_name: branch.branch_name,
      branch_address: branch?.address,
    };

    await CommunicationService.sendCommunication(user.id, otpCommunicationTemplate.id, templateParameters, user.id);

    return {
      confirmation_token: tokenDoc.confirmation_token,
      confirmation_token_type: tokenDoc.confirmation_token_type,
      confirmation_token_expiry_date: tokenDoc.confirmation_token_expiry_date,
    };
  }

  static async validateConfirmationToken(token: string) {
    return ConfirmationTokenService.validateConfirmationToken(token);
  }

  static async oneTimePin(confirmationToken: string, oneTimePin: string) {
    const tokenDoc = await ConfirmationTokenService.getConfirmationTokenByToken(confirmationToken);
    if (!tokenDoc || tokenDoc.revoked) {
      throw new Error("Invalid token");
    }

    if (tokenDoc.confirmation_token_expiry_date < new Date()) {
      throw new Error("Token expired");
    }

    const ok = await tokenDoc.verifyOtp(oneTimePin);

    await tokenDoc.save();

    if (!ok) {
      if (tokenDoc.otp_attempts >= tokenDoc.max_otp_attempts) {
        await confirmationTokenRepository.revoke(tokenDoc._id as any);
      }
      throw new HttpError("Invalid OTP", StatusCode.BAD_REQUEST);
    }

    const user = await userRepository.findById(tokenDoc.user_id);
    if (!user) {
      throw new Error("User not found");
    }

    const branch = await branchRepository.findById(user.branch_id);
    if (!branch) {
      throw new Error("Branch not found");
    }

    if (tokenDoc.confirmation_token_type === ConfirmationTokenType.OTP_LOGIN_TOKEN) {
      const branch = await branchRepository.findById(user.branch_id);
      if (!branch) {
        throw new Error("Branch not found");
      }

      const access_token = generateJwtToken(user, branch!);
      const refresh_token = generateRefreshToken(user);

      await confirmationTokenRepository.markConfirmed(tokenDoc._id as any);

      return [
        {
          access_token,
          refresh_token,
          access_token_expires_at: getAccessTokenExpiry(),
          refresh_token_expires_at: getRefreshTokenExpiry(),
          user: user.toJSON(),
        },
        "OTP validated",
      ] as const;
    }

    if (
      tokenDoc.confirmation_token_type === ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN ||
      tokenDoc.confirmation_token_type === ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN ||
      tokenDoc.confirmation_token_type === ConfirmationTokenType.OTP_CONFIRM_LOGIN_TOKEN
    ) {
      const token = (ConfirmationToken as any).generateToken();

      const passwordResetTokenDoc = await confirmationTokenRepository.create({
        user_id: user._id as any,
        confirmation_token: token,
        confirmation_token_type: ConfirmationTokenType.PASSWORD_RESET_TOKEN,
        confirmation_token_expiry_date: (ConfirmationToken as any).getExpiryDate(ConfirmationTokenType.PASSWORD_RESET_TOKEN),
        createdBy: new Types.ObjectId(user.id),
        updatedBy: new Types.ObjectId(user.id),
      });

      let customeMessage: string;

      switch (tokenDoc.confirmation_token_type) {
        case ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN:
          customeMessage = "OTP Verified. Your password has expired, reset is required";
          break;

        case ConfirmationTokenType.OTP_CONFIRM_LOGIN_TOKEN:
          customeMessage = "OTP Verified. Your account is not confirmed, reset your password";
          break;

        case ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN:
          customeMessage = "OTP Verified. Reset your password";
          break;
      }

      await confirmationTokenRepository.markConfirmed(tokenDoc._id as any);

      return [
        {
          confirmation_token: passwordResetTokenDoc.confirmation_token,
          confirmation_token_type: passwordResetTokenDoc.confirmation_token_type,
          confirmation_token_expiry_date: passwordResetTokenDoc.confirmation_token_expiry_date,
        },
        customeMessage,
      ] as const;
    }

    throw new Error("Unsupported confirmation token type");
  }

  static async passwordReset(token: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const tokenDoc = await ConfirmationTokenService.getConfirmationTokenByToken(token);
    if (
      !tokenDoc ||
      tokenDoc.revoked ||
      tokenDoc.confirmation_token_type !== ConfirmationTokenType.PASSWORD_RESET_TOKEN ||
      tokenDoc.confirmation_token_expiry_date < new Date()
    ) {
      throw new Error("Invalid token");
    }

    const user = await userRepository.findById(tokenDoc.user_id);
    if (!user) {
      throw new Error("User not found");
    }

    await userRepository.updateById(user._id, { password });
    const branch = await branchRepository.findById(user.branch_id);
    const access_token = generateJwtToken(user, branch!);
    const refresh_token = generateRefreshToken(user);

    await confirmationTokenRepository.markConfirmed(tokenDoc._id as any);

    const updatedUser = await userRepository.updateById(user._id, { confirmed: true, lastLoginAt: new Date(), failedLoginAttempts: 0 });
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      access_token,
      refresh_token,
      access_token_expires_at: getAccessTokenExpiry(),
      refresh_token_expires_at: getRefreshTokenExpiry(),
      user: updatedUser.toJSON(),
    };
  }

  static async passwordForgot(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const token = (ConfirmationToken as any).generateToken();
    const otp = (ConfirmationToken as any).generateOtp();

    const tokenDoc = await confirmationTokenRepository.create({
      user_id: user._id as any,
      confirmation_token: token,
      confirmation_token_type: ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN,
      confirmation_token_expiry_date: (ConfirmationToken as any).getExpiryDate(ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN),
      createdBy: new Types.ObjectId(user.id),
      updatedBy: new Types.ObjectId(user.id),
    });

    await tokenDoc.setOtp(otp);
    await tokenDoc.save();

    const otpCommunicationTemplate = await communicationTemplateRepository.findOne({ type: CommunicationType.ONE_TIME_PIN });
    if (!otpCommunicationTemplate) {
      throw new Error("Invalid or inactive template");
    }

    const branch = await branchRepository.findById(user.branch_id);
    if (!branch) {
      throw new Error("Invalid or inactive branch");
    }

    const templateParameters = {
      otp: otp,
      branch_name: branch.branch_name,
      branch_address: branch?.address,
    };

    await CommunicationService.sendCommunication(user.id, otpCommunicationTemplate.id, templateParameters, user.id);

    return {
      confirmation_token: tokenDoc.confirmation_token,
      confirmation_token_type: tokenDoc.confirmation_token_type,
      confirmation_token_expiry_date: tokenDoc.confirmation_token_expiry_date,
    };
  }

  static async refreshToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN as string) as any;

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    const branch = await branchRepository.findById(user.branch_id);
    const access_token = generateJwtToken(user, branch!);

    return {
      access_token,
      access_token_expires_at: getAccessTokenExpiry(),
      user: user.toJSON(),
    };
  }
}
