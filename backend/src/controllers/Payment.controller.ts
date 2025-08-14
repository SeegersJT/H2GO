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
      const { id } = req.params;
      if (!id) {
        return res.error(null, { message: "[id] required.", code: StatusCode.BAD_REQUEST });
      }
      const result = await PaymentService.getById(id);
      return res.success(result, { message: "Retrieved payment successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await PaymentService.create(req.body);
      return res.success(result, { message: "Created payment successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await PaymentService.update(id, req.body);
      return res.success(result, { message: "Updated payment successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await PaymentService.delete(id);
      return res.success(result, { message: "Deleted payment successfully." });
    } catch (err) {
      next(err);
    }
  };
}
