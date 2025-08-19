import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { InvoiceService } from "../services/Invoice.service";

export class InvoiceController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InvoiceService.getAll();
      return res.success(result, { message: "Retrieved invoices successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoiceId = req.query.invoice_id as string;
      if (!invoiceId) {
        return res.error(null, { message: "[invoice_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await InvoiceService.getById(invoiceId);

      if (!result) {
        return res.error(result, { message: "Invalid or inactive invoice.", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved invoice successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, sku, name, description, product_type, unit, capacity_value, default_price, currency_code } = req.body;
      if (!branch_id || !sku || !name || !description || !product_type || !unit || !capacity_value || !default_price || !currency_code) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await InvoiceService.insertInvoice(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created invoice successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoiceId = req.query.invoice_id as string;
      if (!invoiceId) {
        return res.error(null, { message: "[invoice_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await InvoiceService.updateInvoice(invoiceId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated invoice successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoiceId = req.query.invoice_id as string;
      if (!invoiceId) {
        return res.error(null, { message: "[invoice_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await InvoiceService.deleteInvoice(invoiceId, authenticatedUser.id);
      return res.success(result, { message: "Deleted invoice successfully." });
    } catch (err) {
      next(err);
    }
  };

  static generateForMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const year = Number(req.query.year);
      const month = Number(req.query.month);

      if (!year || !month || !Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
        return res.error(null, { message: "[year] (e.g. 2025) and [month] (1–12) are required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await InvoiceService.generateInvoicesForMonth(year!, month!, authenticatedUser.id);

      return res.success(result, { message: `Generated invoices for ${year}-${String(month).padStart(2, "0")}` });
    } catch (err) {
      next(err);
    }
  };

  static generateForUserAndMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.user_id as string;
      if (!userId) {
        return res.error(null, { message: "[user_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const year = Number(req.query.year);
      const month = Number(req.query.month);

      if (!year || !month || !Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
        return res.error(null, { message: "[year] (e.g. 2025) and [month] (1–12) are required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await InvoiceService.generateInvoiceForUserAndMonth(userId, year!, month!, authenticatedUser.id);
      return res.success(result, { message: `Generated invoice(s) for user for ${year}-${String(month).padStart(2, "0")}` });
    } catch (err) {
      next(err);
    }
  };
}
