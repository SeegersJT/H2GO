import { StatusCodeType } from "./constants/StatusCode.constant";

export class HttpError extends Error {
  public code: StatusCodeType;
  public isOperational: boolean;

  constructor(message: string, code: StatusCodeType = 500, isOperational = true) {
    super(message);
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
