import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { AuthService } from "../services/Auth.service";
import { UserService } from "../services/User.service";
import { BranchService } from "../services/Branch.service";
import { generateJwtToken } from "../utils/Jwt.util";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { ConfirmationTokenService } from "../services/ConfirmationToken.service";

export class AuthController {
  static loginWithEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.fail(null, {
          message: "Email and password are required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.loginWithEmail(email, password);

      return res.succeed(result, {
        message:
          result.confirmation_token_type === ConfirmationTokenType.PASSWORD_RESET ? "Password expired. Reset token sent." : "Sent OTP successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  static oneTimePinLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, otp } = req.body;

      if (!token || !otp) {
        return res.fail(null, {
          message: "Token and OTP are required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.oneTimePinLogin(token, otp);

      return res.succeed(result, {
        message: "Login successful.",
      });
    } catch (err) {
      next(err);
    }
  };

  static passwordResetLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.fail(null, {
          message: "Token and Password are required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.passwordResetLogin(token, password);

      return res.succeed(result, {
        message: "Password Reset and Login successful.",
      });
    } catch (err) {
      next(err);
    }
  };

  static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.fail(null, {
          message: "Refresh token required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN!) as { id: string };

      const user = await UserService.getUserById(payload.id);

      if (!user) {
        return res.fail(null, {
          message: "User not found.",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const branch = await BranchService.getBranchById(user.branch_id.toString());

      if (!branch) {
        return res.fail(null, {
          message: "Branch not found.",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const newAccessToken = generateJwtToken(user, branch);

      return res.succeed(
        {
          accessToken: newAccessToken,
        },
        {
          message: "Access token refreshed.",
        }
      );
    } catch (err) {
      next(err);
    }
  };
}
