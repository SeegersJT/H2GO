import { Request, Response, NextFunction } from "express";
import { StatusCodeType } from "../utils/constants/StatusCode.constant";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../utils/ResponseHandler.util";

declare global {
  namespace Express {
    interface Response {
      succeed: (
        data: any,
        options?: {
          message?: string;
          code?: StatusCodeType;
        }
      ) => Response;

      fail: (
        error: any,
        options?: {
          message?: string;
          code?: StatusCodeType;
        }
      ) => Response;
    }
  }
}

export const responseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.succeed = (data, { message, code } = {}) => {
    return handleSuccessResponse(res, data, message, code);
  };

  res.fail = (error, { message, code } = {}) => {
    return handleErrorResponse(res, error, message, code);
  };

  return next();
};
