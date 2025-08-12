import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import log from "../utils/Logger";
import { AuthenticatedUserPayload } from "../types/AuthenticatedUserPayload";

const WHITELISTED_PATHS = ["/api/v1/auth"];

const isWhitelisted = (path: string): boolean => {
  return WHITELISTED_PATHS.some((prefix) => path.startsWith(prefix));
};

const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (isWhitelisted(req.path)) {
    return next();
  }

  const JWT_SECRET = process.env.JWT_SECRET as string;

  if (!JWT_SECRET) {
    log.fatal().database("JWT_SECRET must be defined in environment variables.");
    process.exit(1);
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.fail(null, {
      message: "Access token missing or malformed.",
      code: StatusCode.UNAUTHORIZED,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUserPayload;
    req.authenticatedUser = decoded;

    next();
  } catch {
    return res.fail(null, {
      message: "Invalid or expired access token.",
      code: StatusCode.UNAUTHORIZED,
    });
  }
};

export default authenticateMiddleware;
