import { Request, Response, NextFunction } from "express";
import { RouteService } from "../services/Route.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class RouteController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await RouteService.getAll();
      return res.succeed(result, { message: "Retrieved routes successfully." });
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
      const result = await RouteService.getById(id);
      return res.succeed(result, { message: "Retrieved route successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await RouteService.create(req.body);
      return res.succeed(result, { message: "Created route successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await RouteService.update(id, req.body);
      return res.succeed(result, { message: "Updated route successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await RouteService.delete(id);
      return res.succeed(result, { message: "Deleted route successfully." });
    } catch (err) {
      next(err);
    }
  };
}
