import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/Order.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class OrderController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await OrderService.getAll();
      return res.success(result, { message: "Retrieved orders successfully." });
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
      const result = await OrderService.getById(id);
      return res.success(result, { message: "Retrieved order successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await OrderService.create(req.body);
      return res.success(result, { message: "Created order successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await OrderService.update(id, req.body);
      return res.success(result, { message: "Updated order successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await OrderService.delete(id);
      return res.success(result, { message: "Deleted order successfully." });
    } catch (err) {
      next(err);
    }
  };
}
