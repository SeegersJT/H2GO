import { Request, Response, NextFunction } from "express";
import { StockBalanceService } from "../services/StockBalance.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class StockBalanceController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await StockBalanceService.getAll();
      return res.succeed(result, { message: "Retrieved stockbalances successfully." });
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
      const result = await StockBalanceService.getById(id);
      return res.succeed(result, { message: "Retrieved stockbalance successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await StockBalanceService.create(req.body);
      return res.succeed(result, { message: "Created stockbalance successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await StockBalanceService.update(id, req.body);
      return res.succeed(result, { message: "Updated stockbalance successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await StockBalanceService.delete(id);
      return res.succeed(result, { message: "Deleted stockbalance successfully." });
    } catch (err) {
      next(err);
    }
  };
}
