import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { AssetService } from "../services/Asset.service";

export class AssetController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AssetService.getAll();
      return res.succeed(result, { message: "Retrieved assets successfully." });
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
      const result = await AssetService.getById(id);
      return res.succeed(result, { message: "Retrieved asset successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AssetService.create(req.body);
      return res.succeed(result, { message: "Created asset successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await AssetService.update(id, req.body);
      return res.succeed(result, { message: "Updated asset successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await AssetService.delete(id);
      return res.succeed(result, { message: "Deleted asset successfully." });
    } catch (err) {
      next(err);
    }
  };
}
