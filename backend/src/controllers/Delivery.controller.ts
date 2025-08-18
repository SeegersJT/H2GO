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

      const result = await DeliveryService.insertDelivery(req.body, authenticatedUser.id);
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

      const result = await DeliveryService.updateDelivery(deliveryId, req.body, authenticatedUser.id);
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

      const result = await DeliveryService.deleteDelivery(deliveryId, authenticatedUser.id);
      return res.success(result, { message: "Deleted delivery successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryId = req.query.delivery_id as string;
      const { status } = req.body;
      if (!deliveryId || !status) {
        return res.error(null, { message: "[delivery_id] and [status] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await DeliveryService.setStatus(deliveryId, status, authenticatedUser.id);
      return res.success(result, { message: "Updated delivery status successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateProof = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryId = req.query.delivery_id as string;
      const { proof } = req.body;
      if (!deliveryId || !proof) {
        return res.error(null, { message: "[delivery_id] and [proof] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await DeliveryService.setProof(deliveryId, proof, authenticatedUser.id);
      return res.success(result, { message: "Updated delivery proof successfully." });
    } catch (err) {
      next(err);
    }
  };

  static addEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryId = req.query.delivery_id as string;
      const { type, data } = req.body;
      if (!deliveryId || !type) {
        return res.error(null, { message: "[delivery_id] and [type] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await DeliveryService.addEvent(deliveryId, { type, data }, authenticatedUser.id);
      return res.success(result, { message: "Added delivery event successfully." });
    } catch (err) {
      next(err);
    }
  };

  static swapProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryId = req.query.delivery_id as string;
      const { outbound_serial, inbound_serial } = req.body;
      if (!deliveryId || !outbound_serial || !inbound_serial) {
        return res.error(null, {
          message: "[delivery_id], [outbound_serial] and [inbound_serial] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await DeliveryService.swapProducts(deliveryId, outbound_serial, inbound_serial, authenticatedUser.id);
      return res.success(result, { message: "Recorded product swap successfully." });
    } catch (err) {
      next(err);
    }
  };
}
