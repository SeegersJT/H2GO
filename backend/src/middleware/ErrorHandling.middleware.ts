import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import { HttpError } from "../utils/HttpError";

const errorHandlingMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.error(null, { message: err.message, code: err.code });
  }

  return res.error(err, {
    message: "Internal Server Error",
    code: StatusCode.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandlingMiddleware;
