import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { AuthService } from "../services/Auth.service";

export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.error(null, {
          message: "[email] | [password] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.login(email, password);

      return res.success(result, { message: "Sent OTP successfully." });
    } catch (err) {
      next(err);
    }
  };

  static validateConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmation_token } = req.body;

      if (!confirmation_token) {
        return res.error(null, {
          message: "[confirmation_token] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.validateConfirmationToken(confirmation_token);

      if (!result) {
        return res.error(result, {
          message: "Confirmation token validation failed.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      return res.success(result, {
        message: "Confirmation token validated successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  static oneTimePin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmation_token, one_time_pin } = req.body;

      if (!confirmation_token || !one_time_pin) {
        return res.error(null, {
          message: "[confirmation_token] | [one_time_pin] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const [result, message] = await AuthService.oneTimePin(confirmation_token, one_time_pin);

      return res.success(result, {
        message: message,
      });
    } catch (err) {
      next(err);
    }
  };

  static passwordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmation_token, password, confirm_password } = req.body;

      if (!confirmation_token || !password || !confirm_password) {
        return res.error(null, {
          message: "[confirmation_token] | [password] | [confirmation_password] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.passwordReset(confirmation_token, password, confirm_password);

      return res.success(result, {
        message: "Password reset and login successful.",
      });
    } catch (err) {
      next(err);
    }
  };

  static passwordForgot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.error(null, {
          message: "[email] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.passwordForgot(email);

      return res.success(result, {
        message: "Email verified. Sent OTP successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.error(null, {
          message: "[refresh_token] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await AuthService.refreshToken(refresh_token);

      return res.success(result, {
        message: "Access token refreshed Successfully.",
      });
    } catch (err) {
      next(err);
    }
  };
}
