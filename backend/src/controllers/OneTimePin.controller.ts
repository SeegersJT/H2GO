import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";

import * as oneTimePinService from "../services/OneTimePin.service";

export const insertOneTimePin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const confirmationTokenId = req.query.confirmation_token_id as string;

    const createdBy = "6880ddc0358c320da6f41de1"; // TODO: Replace with Authenticated User Id
    const updatedBy = "6880ddc0358c320da6f41de1"; // TODO: Replace with Authenticated User Id

    if (!confirmationTokenId) {
      return res.fail(null, { message: "Missing required fields", code: StatusCode.BAD_REQUEST });
    }

    const existingOneTimePin = await oneTimePinService.getOneTimePinByConfirmationTokenId(confirmationTokenId);

    if (existingOneTimePin) {
      return res.fail(null, { message: "An OTP for this confirmation token already exists", code: StatusCode.CONFLICT });
    }

    const oneTimePin = await oneTimePinService.insertOneTimePin({
      confirmation_token_id: confirmationTokenId,
      createdBy,
      updatedBy,
    });

    return res.succeed(oneTimePin, {
      message: "OTP created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getOneTimePinByConfirmationTokenId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const confirmationTokenId = req.query.confirmation_token_id as string;

    const oneTimePin = await oneTimePinService.getOneTimePinByConfirmationTokenId(confirmationTokenId);

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
