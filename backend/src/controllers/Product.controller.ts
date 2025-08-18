import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/Product.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class ProductController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.getAll();
      return res.success(result, { message: "Retrieved products successfully." });
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.query.product_id as string;
      if (!productId) {
        return res.error(null, { message: "[product_id] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await ProductService.getById(productId);

      if (!result) {
        return res.error(result, { message: "Invalid or inactive product.", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved product successfully." });
    } catch (err) {
      next(err);
    }
  };

  static insertProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { branch_id, sku, name, description, product_type, unit, capacity_value, default_price, currency_code } = req.body;

      if (!branch_id || !sku || !name || !description || !product_type || !unit || !capacity_value || !default_price || !currency_code) {
        return res.error(null, { message: "Missing required fields" });
      }

      const authenticatedUser = req.authenticatedUser;

      if (!authenticatedUser) {
        return res.error(null, {
          message: "Unauthorized",
          code: StatusCode.UNAUTHORIZED,
        });
      }

      const result = await ProductService.insertProduct(req.body, authenticatedUser.id);

      return res.success(result, { message: "Created product successfully." });
    } catch (err) {
      next(err);
    }
  };

  static updateProduct = async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await ProductService.updateProduct(productId, req.body, authenticatedUser.id);
      return res.success(result, { message: "Updated product successfully." });
    } catch (err) {
      next(err);
    }
  };

  static deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await ProductService.deleteProduct(productId, authenticatedUser.id);
      return res.success(result, { message: "Deleted product successfully." });
    } catch (err) {
      next(err);
    }
  };
}
