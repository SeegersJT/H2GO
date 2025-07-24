import { Request, Response, NextFunction } from "express";
import { handleErrorResponse, handleSuccessResponse } from "../utils/ResponseHandler.util";
import { StatusCodeType } from "../utils/constants/StatusCode.constant";

declare global {
  namespace Express {
    interface Response {
      succeed: (
        data: any,
        options?: {
          message?: string;
          code?: StatusCodeType;
          meta?: Record<string, any>;
          requestId?: string;
        }
      ) => Response;

      fail: (
        error: any,
        options?: {
          message?: string;
          code?: StatusCodeType;
          requestId?: string;
        }
      ) => Response;
    }
  }
}

export const responsesMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.succeed = (data, { message = "Success", code, meta, requestId } = {}) => {
    return handleSuccessResponse(res, data, message, code, meta, requestId);
  };

  res.fail = (error, { message = "Internal Server Error", code, requestId } = {}) => {
    return handleErrorResponse(res, error, message, code, requestId);
  };

  next();
};
