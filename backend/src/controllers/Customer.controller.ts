import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { CustomerService } from "../services/Customer.service";

export class CustomerController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CustomerService.getAll();
      return res.success(result, { message: "Retrieved customers successfully." });
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
      const result = await CustomerService.getById(id);
      return res.success(result, { message: "Retrieved customer successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, name, email, phone } = req.body;

      if (!branch_id || !name || !email || !phone) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await CustomerService.insertCustomer(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created customer successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.error(null, {
          message: "[id] required.",
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

      const result = await CustomerService.updateCustomer(id, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated customer successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.error(null, {
          message: "[id] required.",
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

      const result = await CustomerService.deleteCustomer(id, authenticatedUser.id);
      return res.success(result, { message: "Deleted customer successfully." });
    } catch (err) {
      next(err);
    }
  };
}
