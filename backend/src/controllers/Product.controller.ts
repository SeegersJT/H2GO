import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/Product.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class ProductController {
  static getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.getAll();
      return res.succeed(result, { message: "Retrieved products successfully." });
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
      const result = await ProductService.getById(id);
      return res.succeed(result, { message: "Retrieved product successfully." });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.create(req.body);
      return res.succeed(result, { message: "Created product successfully." });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await ProductService.update(id, req.body);
      return res.succeed(result, { message: "Updated product successfully." });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await ProductService.delete(id);
      return res.succeed(result, { message: "Deleted product successfully." });
    } catch (err) {
      next(err);
    }
  };
}
