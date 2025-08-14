import { Request, Response, NextFunction } from "express";
import { VehicleService } from "../services/Vehicle.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class VehicleController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await VehicleService.getAll();
      return res.success(result, { message: "Retrieved vehicles successfully." });
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
      const result = await VehicleService.getById(id);
      return res.success(result, { message: "Retrieved vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await VehicleService.create(req.body);
      return res.success(result, { message: "Created vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await VehicleService.update(id, req.body);
      return res.success(result, { message: "Updated vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await VehicleService.delete(id);
      return res.success(result, { message: "Deleted vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };
}
