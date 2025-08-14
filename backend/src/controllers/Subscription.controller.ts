import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/Subscription.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class SubscriptionController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await SubscriptionService.getAll();
      return res.succeed(result, { message: "Retrieved subscriptions successfully." });
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
      const result = await SubscriptionService.getById(id);
      return res.succeed(result, { message: "Retrieved subscription successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await SubscriptionService.create(req.body);
      return res.succeed(result, { message: "Created subscription successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await SubscriptionService.update(id, req.body);
      return res.succeed(result, { message: "Updated subscription successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await SubscriptionService.delete(id);
      return res.succeed(result, { message: "Deleted subscription successfully." });
    } catch (err) {
      next(err);
    }
  };
}
