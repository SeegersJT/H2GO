import { userRepository } from "../repositories/User.repository";
import { Utils } from "../utils/Utils";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { ConfirmationTokenService } from "./ConfirmationToken.service";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const match = await Utils.comparePasswords(password, user.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }

    const token = Utils.generateSecureConfirmationToken();
    await ConfirmationTokenService.insertConfirmationToken({
      user_id: user._id as any,
      confirmation_token: token,
      confirmation_token_type: ConfirmationTokenType.OTP_LOGIN_TOKEN,
      confirmation_token_expiry_date: Utils.getConfirmationTokenExpiry(ConfirmationTokenType.OTP_LOGIN_TOKEN),
    });

    return { confirmation_token: token };
  }

  static async validateConfirmationToken(token: string) {
    return ConfirmationTokenService.validateConfirmationToken(token);
  }

  static async oneTimePin(confirmationToken: string, oneTimePin: string) {
    // Placeholder for OTP validation
    return [{ confirmationToken, oneTimePin }, "OTP processed"] as const;
  }

  static async passwordForgot(email: string) {
    // Placeholder for password forgot flow
    return { email };
  }

  static async passwordReset(token: string, password: string, confirmPassword: string) {
    // Placeholder for password reset flow
    return { token };
  }

  static async refreshToken(refreshToken: string) {
    // Placeholder for refresh token flow
    return { refreshToken };
  }
}
