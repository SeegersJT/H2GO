import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";

import * as authService from "../services/Auth.service";

export const loginWithEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.fail(null, {
        message: "Email and password are required.",
        code: StatusCode.BAD_REQUEST,
      });
    }

    const result = await authService.loginWithEmail(email, password);

    return res.succeed(result, {
      message: "Sent OTP successfully.",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOtpLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, otp } = req.body;

    if (!token || !otp) {
      return res.fail(null, {
        message: "Token and OTP are required.",
        code: StatusCode.BAD_REQUEST,
      });
    }

    const result = await authService.verifyOtpAndLogin(token, otp);

    return res.succeed(result, {
      message: "Login successful.",
    });
  } catch (err) {
    next(err);
  }
};
