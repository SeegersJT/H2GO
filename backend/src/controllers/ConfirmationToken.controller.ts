import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { Types } from "mongoose";
import { ConfirmationTokenService } from "../services/ConfirmationToken.service";

export class ConfirmationTokenController {
  static getConfirmationTokenByToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmation_token } = req.body;

      if (!confirmation_token) {
        return res.error(null, { message: "Missing confirmation token." });
      }

      const result = await ConfirmationTokenService.getConfirmationTokenByToken(confirmation_token);

      return res.success(result, {
        message: "Retrieved confirmation token successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  static validateConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmation_token } = req.body;

      if (!confirmation_token) {
        return res.error(null, {
          message: "Missing confirmation token.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const result = await ConfirmationTokenService.validateConfirmationToken(confirmation_token);

      return res.success(result, { message: "Token validated successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, confirmation_token_type } = req.body;

      if (!user_id || !confirmation_token_type) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await ConfirmationTokenService.insertConfirmationToken({
        confirmation_token_type: confirmation_token_type,
        user_id: user_id,
        createdBy: new Types.ObjectId(authenticatedUser.id),
      });

      return res.success(result, {
        message: "Token created successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static invalidateConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmation_token } = req.body;

      if (!confirmation_token) {
        return res.error(false, {
          message: "Missing confirmation token.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const existingConfirmationToken = await ConfirmationTokenService.getConfirmationTokenByFields({
        confirmation_token: confirmation_token,
      });

      if (!existingConfirmationToken) {
        return res.error(false, {
          message: "Token not found or invalid.",
          code: StatusCode.NOT_FOUND,
        });
      }

      if (existingConfirmationToken.confirmed) {
        return res.error(null, { message: "Token already invalidated.", code: StatusCode.CONFLICT });
      }

      const updatedConfirmationToken = await ConfirmationTokenService.updateConfirmationToken(existingConfirmationToken.id, {
        confirmed: true,
        updatedBy: new Types.ObjectId(authenticatedUser.id),
      });

      return res.success(updatedConfirmationToken, { message: "Token Invalidated successfully." });
    } catch (err) {
      next(err);
    }
  };
}
