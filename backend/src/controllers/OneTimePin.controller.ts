import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { OneTimePinService } from "../services/OneTimePin.service";
export class OneTimePinController {
  static getOneTimePinByConfirmationTokenId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const confirmationTokenId = req.query.confirmation_token_id as string;

      if (!confirmationTokenId) {
        return res.fail(null, { message: "Confirmation token ID is required", code: StatusCode.NOT_FOUND });
      }

      const oneTimePin = await OneTimePinService.getOneTimePinByConfirmationTokenId(confirmationTokenId);

      if (!oneTimePin) {
        return res.fail(null, { message: "OTP not found", code: StatusCode.NOT_FOUND });
      }

      return res.succeed(oneTimePin, {
        message: "OTP retrieved successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  static insertOneTimePin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const confirmationTokenId = req.query.confirmation_token_id as string;

      if (!confirmationTokenId) {
        return res.fail(null, { message: "Missing required fields", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.fail(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const existingOneTimePin = await OneTimePinService.getOneTimePinByConfirmationTokenId(confirmationTokenId);

      if (existingOneTimePin) {
        return res.fail(null, { message: "An OTP for this confirmation token already exists", code: StatusCode.CONFLICT });
      }

      const oneTimePin = await OneTimePinService.insertOneTimePin({
        confirmation_token_id: confirmationTokenId,
        createdBy: authenticatedUser.id,
        updatedBy: authenticatedUser.id,
      });

      return res.succeed(oneTimePin, {
        message: "OTP created successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
