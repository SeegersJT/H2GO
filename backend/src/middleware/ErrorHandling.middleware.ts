import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HTTPError";
import { StatusCode } from "../utils/constants/StatusCode.constant";

const errorHandlingMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.fail(null, { message: err.message, code: err.code });
  }

  return res.fail(err, {
    message: "Internal Server Error",
    code: StatusCode.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandlingMiddleware;
