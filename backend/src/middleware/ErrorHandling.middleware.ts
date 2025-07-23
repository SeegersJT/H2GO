import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { HttpError } from "../utils/HttpError";

const errorHandlingMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.fail(null, { message: err.message, code: err.code });
  }

  return res.fail(err, {
    message: "Internal Server Error",
    code: StatusCode.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandlingMiddleware;
