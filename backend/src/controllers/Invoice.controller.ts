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

  static generateForEligibleUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InvoiceService.generateInvoicesForEligibleUsers();
      return res.success(result, { message: "Generated invoices for eligible users." });
    } catch (err) {
      next(err);
    }
  };

  static generateCurrentMonth = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InvoiceService.generateCurrentMonthInvoices();
      return res.success(result, { message: "Generated current month's invoices." });
    } catch (err) {
      next(err);
    }
  };

  static generatePaymentsDue = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InvoiceService.generatePaymentsDueInvoices();
      return res.success(result, { message: "Generated payments due invoices." });
    } catch (err) {
      next(err);
    }
  };

  static generateCurrentMonthForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.user_id;
      if (!userId) {
        return res.error(null, { message: "[user_id] required.", code: StatusCode.BAD_REQUEST });
      }
      const result = await InvoiceService.generateCurrentMonthInvoiceForUser(userId);
      return res.success(result, { message: "Generated current month's invoice for user." });
    } catch (err) {
      next(err);
    }
  };

  static generateByDateRange = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res.error(null, { message: "[start] and [end] required.", code: StatusCode.BAD_REQUEST });
      }
      const result = await InvoiceService.generateInvoicesByDateRange(new Date(start as string), new Date(end as string));
      return res.success(result, { message: "Generated invoices by date range." });
    } catch (err) {
      next(err);
    }
  };
}
