import { Request, Response, NextFunction } from "express";
import { RouteService } from "../services/Route.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class RouteController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await RouteService.getAll();
      return res.success(result, { message: "Retrieved routes successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const routeId = req.query.route_id as string;
      if (!routeId) {
        return res.error(null, { message: "[route_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await RouteService.getById(routeId);
      if (!result) {
        return res.error(null, { message: "Invalid or inactive route", code: StatusCode.BAD_REQUEST });
      }
      return res.success(result, { message: "Retrieved route successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branch_id, date, vehicle_id, driver_id, notes } = req.body;
      if (!branch_id || !date || !vehicle_id || !driver_id || !notes) {
        return res.error(null, { message: "Missing required fields.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await RouteService.insertRoute(req.body, authenticatedUser.id);
      return res.success(result, { message: "Created route successfully." });
    } catch (err) {
      next(err);
    }
  };

  static generateRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { branch_id, date, vehicle_id, driver_id, notes } = req.body;
      if (!branch_id || !date || !vehicle_id || !driver_id || !notes) {
        return res.error(null, { message: "Missing required fields.", code: StatusCode.BAD_REQUEST });
      }

      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.error(null, { message: "Unauthorized", code: StatusCode.UNAUTHORIZED });
      }

      const routeDate = new Date(date);
      if (isNaN(routeDate.getTime())) {
        return res.error(null, { message: "Invalid date.", code: StatusCode.BAD_REQUEST });
      }

      const result = await RouteService.generateForDay(branch_id, routeDate, vehicle_id, driver_id, notes, authenticatedUser.id);
      return res.success(result, { message: "Generated route successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const routeId = req.query.route_id as string;
      if (!routeId) {
        return res.error(null, {
          message: "[route_id] required.",
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

      const result = await RouteService.updateRoute(routeId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated route successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteRoute = async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await RouteService.deleteRoute(productId, authenticatedUser.id);
      return res.success(result, { message: "Deleted route successfully." });
    } catch (err) {
      next(err);
    }
  };
}
