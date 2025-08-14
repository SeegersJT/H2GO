import { Request, Response, NextFunction } from "express";
import { CounterService } from "../services/Counter.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class CounterController {
  static getNextSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.fail(null, { message: "[id] required.", code: StatusCode.BAD_REQUEST });
      }
      const result = await CounterService.getNextSequence(id);
      return res.succeed(result, { message: "Retrieved next sequence successfully." });
    } catch (err) {
      next(err);
    }
  };
}
