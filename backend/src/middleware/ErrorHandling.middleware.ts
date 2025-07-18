import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/errors/CustomErrors.util';
import { StatusCode } from '../utils/constants/StatusCode.constant';
import { parseMongoError } from '../utils/errors/CustomMongoDBErrors.util';

const errorHandlingMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.fail(null, { message: err.message, code: err.code });
  }

  const mongoError = parseMongoError(err);
  if (mongoError) {
    return res.fail(null, {
      message: mongoError.message,
      code: mongoError.code,
    });
  }

  return res.fail(err, {
    message: 'Internal Server Error',
    code: StatusCode.INTERNAL_SERVER_ERROR,
  });

};

export default errorHandlingMiddleware;
