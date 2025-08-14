import jwt from "jsonwebtoken";
import { generateJwtToken, generateRefreshToken, getAccessTokenExpiry, getRefreshTokenExpiry } from "../utils/Jwt.util";
import { userRepository } from "../repositories/User.repository";
import { branchRepository } from "../repositories/Branch.repository";
import { confirmationTokenRepository } from "../repositories/ConfirmationToken.repository";
import ConfirmationToken from "../models/ConfirmationToken.model";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { ConfirmationTokenService } from "./ConfirmationToken.service";
import { Types } from "mongoose";

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

    const token = (ConfirmationToken as any).generateToken();
    const otp = (ConfirmationToken as any).generateOtp();
    const tokenDoc = await confirmationTokenRepository.create({
      user_id: user._id as any,
      confirmation_token: token,
      confirmation_token_type: ConfirmationTokenType.OTP_LOGIN_TOKEN,
      confirmation_token_expiry_date: (ConfirmationToken as any).getExpiryDate(ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN),
      createdBy: new Types.ObjectId(user.id),
      updatedBy: new Types.ObjectId(user.id),
    });
    await tokenDoc.setOtp(otp);
    await tokenDoc.save();

    return { confirmation_token: token, otp };
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
      throw new Error("Invalid OTP");
    }

    await confirmationTokenRepository.markConfirmed(tokenDoc._id as any);
    const user = await userRepository.findById(tokenDoc.user_id);
    if (!user) {
      throw new Error("User not found");
    }
    const branch = await branchRepository.findById(user.branch_id);
    const access_token = generateJwtToken(user, branch!);
    const refresh_token = generateRefreshToken(user);
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
    return { confirmation_token: token, otp };
  }

  static async passwordReset(token: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const tokenDoc = await ConfirmationTokenService.getConfirmationTokenByToken(token);

    if (
      !tokenDoc ||
      tokenDoc.revoked ||
      tokenDoc.confirmation_token_type !== ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN ||
      tokenDoc.confirmation_token_expiry_date < new Date() ||
      !tokenDoc.confirmed
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

    return {
      access_token,
      refresh_token,
      access_token_expires_at: getAccessTokenExpiry(),
      refresh_token_expires_at: getRefreshTokenExpiry(),
      user: user.toJSON(),
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
    const new_refresh_token = generateRefreshToken(user);

    return {
      access_token,
      refresh_token: new_refresh_token,
      access_token_expires_at: getAccessTokenExpiry(),
      refresh_token_expires_at: getRefreshTokenExpiry(),
      user: user.toJSON(),
    };
  }
}
