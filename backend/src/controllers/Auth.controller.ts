import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { AuthService } from "../services/Auth.service";
import { UserService } from "../services/User.service";
import { BranchService } from "../services/Branch.service";
import { generateJwtToken } from "../utils/Jwt.util";

export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.fail(null, {
          message: "Email and password are required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.login(email, password);

      return res.succeed(result, { message: "Sent OTP successfully." });
    } catch (err) {
      next(err);
    }
  };

  static validateConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmationToken } = req.body;

      if (!confirmationToken) {
        return res.fail(null, {
          message: "Confirmation Token is required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.validateConfirmationToken(confirmationToken);

      return res.succeed(result, {
        message: "Confirmation Token Validated Successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  static oneTimePin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmationToken, oneTimePin } = req.body;

      if (!confirmationToken || !oneTimePin) {
        return res.fail(null, {
          message: "Confirmation Token and One-Time-Pin are required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const [result, message] = await AuthService.oneTimePin(confirmationToken, oneTimePin);

      return res.succeed(result, {
        message: message,
      });
    } catch (err) {
      next(err);
    }
  };

  static passwordForgot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.fail(null, {
          message: "Email is required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.passwordForgot(email);

      return res.succeed(result, {
        message: "Email Verified. Sent OTP Successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static passwordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmationToken, password, confirmPassword } = req.body;

      if (!confirmationToken || !password) {
        return res.fail(null, {
          message: "Confirmation Token, Password and Confirm Password are required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.passwordReset(confirmationToken, password, confirmPassword);

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
