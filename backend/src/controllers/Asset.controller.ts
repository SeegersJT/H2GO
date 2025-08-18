import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { AssetService } from "../services/Asset.service";

export class AssetController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AssetService.getAll();
      return res.success(result, { message: "Retrieved assets successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetId = req.query.asset_id as string;

      if (!assetId) {
        return res.error(null, { message: "[assetId] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await AssetService.getById(assetId);

      if (!result) {
        return res.error(result, { message: "Invalid or inactive asset", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved asset successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { product_id, serial_no, asset_state, current_holder_type, current_holder_id } = req.body;

      if (!product_id || !serial_no || !asset_state || !current_holder_type || !current_holder_id) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await AssetService.insertAsset(req.body, authenticatedUser.id);

      return res.success(result, { message: "Created asset successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetId = req.query.asset_id as string;

      if (!assetId) {
        return res.error(null, {
          message: "[id] required.",
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

      const result = await AssetService.updateAsset(assetId, req.body, authenticatedUser.id);

      return res.success(result, { message: "Updated asset successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetId = req.query.asset_id as string;

      if (!assetId) {
        return res.error(null, {
          message: "[id] required.",
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

      const result = await AssetService.deleteAsset(assetId, authenticatedUser.id);

      return res.success(result, { message: "Deleted asset successfully." });
    } catch (err) {
      next(err);
    }
  };
}
