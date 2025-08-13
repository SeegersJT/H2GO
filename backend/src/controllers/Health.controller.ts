import { NextFunction, Request, Response } from "express";

export class HealthController {
  static healthCheck = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.succeed(
        { status: "ok" },
        {
          message: "Successfull Health Check",
        }
      );
    } catch (err) {
      next(err);
    }
  };
}
