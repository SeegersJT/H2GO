import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { DriverService } from "../services/Driver.controller";

export class DriverController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DriverService.getAll();
      return res.success(result, { message: "Retrieved drivers successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverId = req.query.driver_id as string;
      if (!driverId) {
        return res.error(null, { message: "[driver_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await DriverService.getById(driverId);
      if (!result) {
        return res.error(null, { message: "Invalid or inactive driver", code: StatusCode.BAD_REQUEST });
      }
      return res.success(result, { message: "Retrieved driver successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { user_id, branch_id, license_class, phone } = req.body;
      if (!user_id || !branch_id || !license_class || !phone) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await DriverService.insertDriver(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created driver successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverId = req.query.driver_id as string;
      if (!driverId) {
        return res.error(null, { message: "[driver_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await DriverService.updateDriver(driverId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated driver successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverId = req.query.driver_id as string;
      if (!driverId) {
        return res.error(null, { message: "[driver_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await DriverService.deleteDriver(driverId, authenticatedUser.id);
      return res.success(result, { message: "Deleted driver successfully." });
    } catch (err) {
      next(err);
    }
  };
}
