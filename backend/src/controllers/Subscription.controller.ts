import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/Subscription.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class SubscriptionController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await SubscriptionService.getAll();
      return res.success(result, { message: "Retrieved subscriptions successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptionId = req.query.subscription_id as string;
      if (!subscriptionId) {
        return res.error(null, { message: "[subscription_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await SubscriptionService.getById(subscriptionId);
      if (!result) {
        return res.error(result, { message: "Invalid or inactive subscription.", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved subscription successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, user_id, address_id, items, rrule, anchor_date, desired_window } = req.body;
      if (!branch_id || !user_id || !address_id || !items || !rrule || !anchor_date || !desired_window) {
        return res.error(null, { message: "Missing required fields" });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.error(null, { message: "At least one item is required" });
      }

      for (const [i, item] of items.entries()) {
        if (!item.product_id) {
          return res.error(null, { message: `Item ${i + 1}: product_id is required` });
        }
        if (!item.quantity || typeof item.quantity !== "number" || item.quantity < 1) {
          return res.error(null, { message: `Item ${i + 1}: quantity must be >= 1` });
        }
        if (item.unit_price !== undefined && (typeof item.unit_price !== "number" || item.unit_price < 0)) {
          return res.error(null, { message: `Item ${i + 1}: unit_price must be >= 0` });
        }
      }

      if (desired_window) {
        if (typeof desired_window !== "object") {
          return res.error(null, { message: "desired_window must be an object" });
        }
        if (!desired_window.start || !desired_window.end) {
          return res.error(null, { message: "desired_window must include both start and end" });
        }
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(desired_window.start) || !timeRegex.test(desired_window.end)) {
          return res.error(null, { message: "desired_window times must be in HH:mm format" });
        }
        if (desired_window.start >= desired_window.end) {
          return res.error(null, { message: "desired_window.start must be before desired_window.end" });
        }
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await SubscriptionService.insertSubscription(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created subscription successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.query.product_id as string;
      if (!productId) {
        return res.error(null, {
          message: "[product_id] required.",
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

      const result = await SubscriptionService.updateSubscription(productId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated subscription successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptionId = req.query.subscription_id as string;
      if (!subscriptionId) {
        return res.error(null, {
          message: "[subscription_id] required.",
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

      const result = await SubscriptionService.deleteSubscription(subscriptionId, authenticatedUser.id);
      return res.success(result, { message: "Deleted subscription successfully." });
    } catch (err) {
      next(err);
    }
  };
}
