import { Request, Response, NextFunction } from "express";
import { ConfirmationTokenType } from "../utils/constants/ConfirmationToken.constant";
import { StatusCode } from "../utils/constants/StatusCode.constant";

import * as confirmationTokenService from "../services/ConfirmationToken.service";

export const getConfirmationTokenByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.fail(null, { message: "Missing confirmation token." });
    }

    const existingConfirmationToken = await confirmationTokenService.getConfirmationTokenByFields({
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

export const validateConfirmationToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.fail(null, {
        message: "Missing confirmation token.",
        code: StatusCode.BAD_REQUEST,
      });
    }

    const existingConfirmationToken = await confirmationTokenService.getConfirmationTokenByFields({
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

export const insertConfirmationToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, confirmation_token_type, createdBy, updatedBy } = req.body;

    if (!user_id || !confirmation_token_type || !createdBy || !updatedBy) {
      return res.fail(null, { message: "Missing required fields" });
    }

    const confirmationToken = await confirmationTokenService.insertConfirmationToken(
      user_id,
      confirmation_token_type as ConfirmationTokenType,
      createdBy,
      updatedBy
    );

    return res.succeed(confirmationToken, {
      message: "Token created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const invalidateConfirmationToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.fail(false, {
        message: "Missing confirmation token.",
        code: StatusCode.BAD_REQUEST,
      });
    }

    const existingConfirmationToken = await confirmationTokenService.getConfirmationTokenByFields({
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

    const updatedConfirmationToken = await confirmationTokenService.updateConfirmationToken(
      existingConfirmationToken.id,
      { confirmed: true }
    );

    return res.succeed(updatedConfirmationToken, { message: "Token Invalidated successfully." });
  } catch (err) {
    next(err);
  }
};
