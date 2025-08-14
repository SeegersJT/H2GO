import { Request, Response, NextFunction } from "express";
import { PriceListService } from "../services/PriceList.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class PriceListController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await PriceListService.getAll();
      return res.success(result, { message: "Retrieved pricelists successfully." });
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
      const result = await PriceListService.getById(id);
      return res.success(result, { message: "Retrieved pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await PriceListService.create(req.body);
      return res.success(result, { message: "Created pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await PriceListService.update(id, req.body);
      return res.success(result, { message: "Updated pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await PriceListService.delete(id);
      return res.success(result, { message: "Deleted pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };
}
