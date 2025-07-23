import { Response } from "express";
import log from "./Logger";
import { StatusCode, StatusCodeType } from "./constants/StatusCode.constant";

interface MetaData {
  [key: string]: unknown;
}

function isError(err: unknown): err is { message?: string; stack?: string } {
  return typeof err === "object" && err !== null && ("message" in err || "stack" in err);
}

export const handleSuccessResponse = (
  res: Response,
  data: unknown = null,
  message = "Success",
  statusCode: StatusCodeType = StatusCode.OK,
  meta: MetaData | null = null,
  requestId: string | null = null
): Response => {
  const response: Record<string, unknown> = {
    status: "Success",
    code: statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(requestId != null ? { requestId } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(meta ? { meta } : {}),
  };

  return res.status(statusCode).json(response);
};

export const handleErrorResponse = (
  res: Response,
  error: unknown = null,
  message = "Internal Server Error",
  statusCode: StatusCodeType = StatusCode.INTERNAL_SERVER_ERROR,
  requestId: string | null = null
): Response => {
  const isDev = process.env.NODE_ENV === "development";

  const response: Record<string, unknown> = {
    status: "Error",
    code: statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(requestId != null ? { requestId } : {}),
    ...(isDev && isError(error) ? { error: error.message } : {}),
  };

  if (isDev && isError(error) && error.stack) {
    log.error().api(`(${statusCode}) ${message}`, error.stack);
  } else if (error !== null && error !== undefined) {
    const errMsg = isError(error) ? error.message : String(error);
    log.error().api(`(${statusCode}) ${message}`, errMsg);
  } else {
    log.error().api(`(${statusCode}) ${message}`);
  }

  return res.status(statusCode).json(response);
};
