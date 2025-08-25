import { Request, Response, NextFunction } from "express";
import { InventoryMovementService } from "../services/InventoryMovement.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class InventoryMovementController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InventoryMovementService.getAll();
      return res.success(result, { message: "Retrieved inventory movements successfully." });
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
      const result = await InventoryMovementService.getById(id);
      return res.success(result, { message: "Retrieved inventory movement successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InventoryMovementService.create(req.body);
      return res.success(result, { message: "Created inventory movement successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await InventoryMovementService.update(id, req.body);
      return res.success(result, { message: "Updated inventory movement successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await InventoryMovementService.delete(id);
      return res.success(result, { message: "Deleted inventory movement successfully." });
    } catch (err) {
      next(err);
    }
  };
}
