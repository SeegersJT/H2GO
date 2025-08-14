import { Request, Response, NextFunction } from "express";
import { DeliveryService } from "../services/Delivery.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class DeliveryController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DeliveryService.getAll();
      return res.success(result, { message: "Retrieved deliverys successfully." });
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
      const result = await DeliveryService.getById(id);
      return res.success(result, { message: "Retrieved delivery successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DeliveryService.create(req.body);
      return res.success(result, { message: "Created delivery successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await DeliveryService.update(id, req.body);
      return res.success(result, { message: "Updated delivery successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await DeliveryService.delete(id);
      return res.success(result, { message: "Deleted delivery successfully." });
    } catch (err) {
      next(err);
    }
  };
}
