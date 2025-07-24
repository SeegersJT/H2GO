import { Request, Response, NextFunction } from "express";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { ConfirmationTokenService } from "../services/ConfirmationToken.service";
import { Types } from "mongoose";

export class ConfirmationTokenController {
  static getConfirmationTokenByToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.fail(null, { message: "Missing confirmation token." });
      }

      const existingConfirmationToken = await ConfirmationTokenService.getConfirmationTokenByFields({
        confirmation_token: token,
      });

      if (!existingConfirmationToken) {
        return res.fail(null, { message: "Token not found or invalid." });
      }

      return res.succeed(existingConfirmationToken, {
        message: "Retrieved Confirmation Token successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  static validateConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.fail(null, {
          message: "Missing confirmation token.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const existingConfirmationToken = await ConfirmationTokenService.getConfirmationTokenByFields({
        confirmation_token: token,
      });

      if (!existingConfirmationToken) {
        return res.fail(null, {
          message: "Token not found or invalid.",
          code: StatusCode.NOT_FOUND,
        });
      }

      if (existingConfirmationToken.confirmed) {
        return res.fail(null, { message: "Token already confirmed.", code: StatusCode.CONFLICT });
      }

      if (new Date() > existingConfirmationToken.confirmation_token_expiry_date) {
        return res.fail(null, { message: "Token has expired.", code: StatusCode.INVALID_TOKEN });
      }

      return res.succeed(true, { message: "Token Validated successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, confirmation_token_type } = req.body;

      if (!user_id || !confirmation_token_type) {
        return res.fail(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.fail(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const confirmationToken = await ConfirmationTokenService.insertConfirmationToken(
        user_id,
        confirmation_token_type as ConfirmationTokenType,
        authenticatedUser.id
      );

      return res.succeed(confirmationToken, {
        message: "Token created successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static invalidateConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.fail(false, {
          message: "Missing confirmation token.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.fail(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const existingConfirmationToken = await ConfirmationTokenService.getConfirmationTokenByFields({
        confirmation_token: token,
      });

      if (!existingConfirmationToken) {
        return res.fail(false, {
          message: "Token not found or invalid.",
          code: StatusCode.NOT_FOUND,
        });
      }

      if (existingConfirmationToken.confirmed) {
        return res.fail(null, { message: "Token already invalidated.", code: StatusCode.CONFLICT });
      }

      const updatedConfirmationToken = await ConfirmationTokenService.updateConfirmationToken(existingConfirmationToken.id, {
        confirmed: true,
        updatedBy: new Types.ObjectId(authenticatedUser.id),
      });

      return res.succeed(updatedConfirmationToken, { message: "Token Invalidated successfully." });
    } catch (err) {
      next(err);
    }
  };
}
