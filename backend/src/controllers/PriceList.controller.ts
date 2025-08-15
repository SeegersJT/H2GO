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
      if (!result) {
        return res.error(result, { message: "Invalid or inactive price list", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertPriceList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, name, currency_code, is_default, items } = req.body;

      if (!branch_id || !name || !currency_code || !is_default || !items) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await PriceListService.insertPriceList(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updatePriceList = async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await PriceListService.updatePriceList(id, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deletePriceList = async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await PriceListService.deletePriceList(id, authenticatedUser.id);
      return res.success(result, { message: "Deleted pricelist successfully." });
    } catch (err) {
      next(err);
    }
  };
}
