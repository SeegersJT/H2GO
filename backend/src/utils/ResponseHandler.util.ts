import { Response } from "express";
import log from "./Logger";
import { StatusCode, StatusCodeType } from "./constants/StatusCode.constant";

interface MetaData {
  [key: string]: any;
}

export const handleSuccessResponse = (
  res: Response,
  data: any = null,
  message = "Success",
  statusCode: StatusCodeType = StatusCode.OK,
  meta: MetaData | null = null,
  requestId: string | null = null
): Response => {
  const response: Record<string, any> = {
    status: "Success",
    code: statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  };

  return res.status(statusCode).json(response);
};

export const handleErrorResponse = (
  res: Response,
  error: any = null,
  message = "Internal Server Error",
  statusCode: StatusCodeType = StatusCode.INTERNAL_SERVER_ERROR,
  requestId: string | null = null
): Response => {
  const isDev = process.env.NODE_ENV === "development";

  const response: Record<string, any> = {
    status: "Error",
    code: statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
    ...(isDev && error && { error: error?.message || error }),
  };

  if (isDev && error?.stack) {
    log.error().api(`(${statusCode}) ${message}`, error.stack);
  } else {
    log.error().api(`(${statusCode}) ${message}`, error?.message || error);
  }

  return res.status(statusCode).json(response);
};
