import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { CustomerService } from "../services/Customer.service";

export class CustomerController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CustomerService.getAll();
      return res.succeed(result, { message: "Retrieved customers successfully." });
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
      const result = await CustomerService.getById(id);
      return res.succeed(result, { message: "Retrieved customer successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CustomerService.create(req.body);
      return res.succeed(result, { message: "Created customer successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CustomerService.update(id, req.body);
      return res.succeed(result, { message: "Updated customer successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CustomerService.delete(id);
      return res.succeed(result, { message: "Deleted customer successfully." });
    } catch (err) {
      next(err);
    }
  };
}
