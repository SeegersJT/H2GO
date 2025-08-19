import { Request, Response, NextFunction } from "express";
import { VehicleService } from "../services/Vehicle.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class VehicleController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await VehicleService.getAll();
      return res.success(result, { message: "Retrieved vehicles successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleId = req.query.vehicle_id as string;
      if (!vehicleId) {
        return res.error(null, { message: "[vehicle_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await VehicleService.getById(vehicleId);
      if (!result) {
        return res.error(null, { message: "Invalid or inactive vehicle", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branch_id, reg_number, type, capacity_value, capacity_unit } = req.body;
      if (!branch_id || !reg_number || !type || !capacity_value || !capacity_unit) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await VehicleService.insertVehicle(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleId = req.query.vehicle_id as string;
      if (!vehicleId) {
        return res.error(null, {
          message: "[vehicle_id] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await VehicleService.updateVehicle(vehicleId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleId = req.query.vehicle_id as string;
      if (!vehicleId) {
        return res.error(null, {
          message: "[vehicle_id] required.",
          code: StatusCode.BAD_REQUEST,
        });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const result = await VehicleService.deleteVehicle(vehicleId, authenticatedUser.id);
      return res.success(result, { message: "Deleted vehicle successfully." });
    } catch (err) {
      next(err);
    }
  };
}
