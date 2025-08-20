import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/Payment.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class PaymentController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await PaymentService.getAll();
      return res.success(result, { message: "Retrieved payments successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = req.query.payment_id as string;
      if (!paymentId) {
        return res.error(null, { message: "[payment_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await PaymentService.getById(paymentId);
      if (!result) {
        return res.error(result, { message: "Invalid or inactive payment.", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved payment successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await PaymentService.createPayment(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created payment successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = req.query.payment_id as string;
      if (!paymentId) {
        return res.error(null, {
          message: "[payment_id] required.",
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

      const result = await PaymentService.update(paymentId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated payment successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deletePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = req.query.payment_id as string;
      if (!paymentId) {
        return res.error(null, {
          message: "[payment_id] required.",
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

      const result = await PaymentService.delete(paymentId, authenticatedUser.id);
      return res.success(result, { message: "Deleted payment successfully." });
    } catch (err) {
      next(err);
    }
  };
}
