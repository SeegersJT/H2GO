import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { DriverService } from "../services/Driver.controller";

export class DriverController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DriverService.getAll();
      return res.success(result, { message: "Retrieved drivers successfully." });
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
      const result = await DriverService.getById(id);
      return res.success(result, { message: "Retrieved driver successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DriverService.create(req.body);
      return res.success(result, { message: "Created driver successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await DriverService.update(id, req.body);
      return res.success(result, { message: "Updated driver successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await DriverService.delete(id);
      return res.success(result, { message: "Deleted driver successfully." });
    } catch (err) {
      next(err);
    }
  };
}
