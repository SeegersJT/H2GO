import { Response } from "express";
import { StatusCode, StatusCodeType } from "./constants/StatusCode.constant";

interface MetaData {
  [key: string]: any;
}

export const handleSuccessResponse = (
  res: Response,
  data = null,
  message = "Success",
  statusCode: StatusCodeType  = StatusCode.OK,
  meta: MetaData | null = null,
  requestId: string | null = null
): Response => {
  const response: Record<string, any> = {
    status: "Success",
    code: statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
    ...{ data },
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
    console.error(`[${statusCode}] ${message}`, error.stack);
  } else {
    console.error(`[${statusCode}] ${message}`, error?.message || error);
  }

  return res.status(statusCode).json(response);
};
