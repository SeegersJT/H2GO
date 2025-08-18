import { Request, Response, NextFunction } from "express";
import { CounterService } from "../services/Counter.service";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class CounterController {
  static getNextSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const counterId = req.query.counter_id as string;
      if (!counterId) {
        return res.error(null, { message: "[counterId] required.", code: StatusCode.BAD_REQUEST });
      }

      const result = await CounterService.getNextSequence(counterId);

      if (!result) {
        return res.error(null, { message: "Invalid or inactive counterId.", code: StatusCode.BAD_REQUEST });
      }

      return res.success(result, { message: "Retrieved next sequence successfully." });
    } catch (err) {
      next(err);
    }
  };
}
