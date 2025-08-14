import { Request, Response, NextFunction } from "express";
import log from "../utils/Logger";
import { StatusCode, StatusCodeType } from "../utils/constants/StatusCode.constant";

interface SuccessOptions {
  message?: string;
  code?: StatusCodeType;
  meta?: Record<string, any>;
  requestId?: string;
}

interface ErrorOptions {
  message?: string;
  code?: StatusCodeType;
  requestId?: string;
}

function isError(err: any): err is { message?: string; stack?: string } {
  return typeof err === "object" && err !== null && ("message" in err || "stack" in err);
}

function sendSuccessResponse(
  res: Response,
  data: any,
  { message, code, meta, requestId }: Required<Pick<SuccessOptions, "message" | "code">> & SuccessOptions
): Response {
  const response: Record<string, any> = {
    status: "Success",
    code,
    message,
    timestamp: new Date().toISOString(),
    ...(requestId != null ? { requestId } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(meta ? { meta } : {}),
  };

  return res.status(code).json(response);
}

function sendErrorResponse(
  res: Response,
  error: any,
  { message, code, requestId }: Required<Pick<ErrorOptions, "message" | "code">> & ErrorOptions
): Response {
  const isDev = process.env.NODE_ENV === "development";

  const response: Record<string, any> = {
    status: "Error",
    code,
    message,
    timestamp: new Date().toISOString(),
    ...(requestId != null ? { requestId } : {}),
    ...(isDev && isError(error) ? { error: error.message } : {}),
  };

  if (isDev && isError(error) && error.stack) {
    log.error().api(`(${code}) ${message}`, error.stack);
  } else if (error !== null && error !== undefined) {
    const errMsg = isError(error) ? error.message : String(error);
    log.error().api(`(${code}) ${message}`, errMsg);
  } else {
    log.error().api(`(${code}) ${message}`);
  }

  return res.status(code).json(response);
}

declare global {
  namespace Express {
    interface Response {
      success: (data: any, options?: SuccessOptions) => Response;
      error: (error: any, options?: ErrorOptions) => Response;
    }
  }
}

export const responseMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  res.success = (data, { message = "Success", code = StatusCode.OK, meta, requestId }: SuccessOptions = {}) => {
    return sendSuccessResponse(res, data, { message, code, meta, requestId });
  };

  res.error = (error, { message = "Internal Server Error", code = StatusCode.INTERNAL_SERVER_ERROR, requestId }: ErrorOptions = {}) => {
    return sendErrorResponse(res, error, { message, code, requestId });
  };

  next();
};
