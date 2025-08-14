import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { InvoiceService } from "../services/Invoice.service";

export class InvoiceController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InvoiceService.getAll();
      return res.succeed(result, { message: "Retrieved invoices successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.fail(null, { message: "[id] required.", code: StatusCode.BAD_REQUEST });
      }
      const result = await InvoiceService.getById(id);
      return res.succeed(result, { message: "Retrieved invoice successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InvoiceService.create(req.body);
      return res.succeed(result, { message: "Created invoice successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await InvoiceService.update(id, req.body);
      return res.succeed(result, { message: "Updated invoice successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await InvoiceService.delete(id);
      return res.succeed(result, { message: "Deleted invoice successfully." });
    } catch (err) {
      next(err);
    }
  };
}
