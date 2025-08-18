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
      const deliveryId = req.query.delivery_id as string;
      if (!deliveryId) {
        return res.error(null, { message: "[delivery_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await DeliveryService.getById(deliveryId);
      if (!result) {
        return res.success(result, { message: "Invalid or inactive delivery" });
      }
      return res.success(result, { message: "Retrieved delivery successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { route_id, branch_id, user_id, address_id, items, window_start, window_end, source } = req.body;
      if (!route_id || !branch_id || !user_id || !address_id || !items || !window_start || !window_end || !source) {
        return res.error(null, { message: "Missing required fileds", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await DeliveryService.create(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created delivery successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryId = req.query.delivery_id as string;
      if (!deliveryId) {
        return res.error(null, {
          message: "[delivery_id] required.",
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

      const result = await DeliveryService.update(deliveryId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated delivery successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryId = req.query.delivery_id as string;
      if (!deliveryId) {
        return res.error(null, {
          message: "[delivery_id] required.",
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

      const result = await DeliveryService.delete(deliveryId, authenticatedUser.id);
      return res.success(result, { message: "Deleted delivery successfully." });
    } catch (err) {
      next(err);
    }
  };
}
