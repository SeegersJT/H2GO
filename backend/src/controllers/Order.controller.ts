import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/Order.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

function isValidMoney(n: any) {
  return typeof n === "number" && isFinite(n) && n >= 0;
}

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
      const orderId = req.query.order_id as string;
      if (!orderId) {
        return res.error(null, { message: "[order_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await OrderService.getById(orderId);
      if (!result) {
        return res.error(null, { message: "Invalid or inactive order", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved order successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, user_id, address_id, items, desired_date, window_start, window_end, totals, source, status, notes } = req.body;

      if (
        !branch_id ||
        !user_id ||
        !address_id ||
        !items ||
        !desired_date ||
        !window_start ||
        !window_end ||
        !totals ||
        !source ||
        !status ||
        !notes
      ) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await OrderService.insertOrder(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created order successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.query.order_id as string;
      if (!orderId) {
        return res.error(null, { message: "[order_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await OrderService.updateOrder(orderId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated order successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await OrderService.deleteOrder(id);
      return res.success(result, { message: "Deleted order successfully." });
    } catch (err) {
      next(err);
    }
  };
}
