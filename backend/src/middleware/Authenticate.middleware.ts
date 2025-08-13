import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import log from "../utils/Logger";
import { AuthenticatedUserPayload } from "../types/AuthenticatedUserPayload";

const WHITELIST: RegExp[] = [/^\/health\/?$/i, /^\/api\/v1\/auth(\/.*)?$/i];

if (process.env.AUTH_WHITELIST) {
  for (const raw of process.env.AUTH_WHITELIST.split(",")
    .map((s) => s.trim())
    .filter(Boolean)) {
    try {
      const esc = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      WHITELIST.push(new RegExp(`^${esc}(\\/.*)?$`, "i"));
    } catch {}
  }
}

const isWhitelisted = (urlPath: string): boolean => WHITELIST.some((rx) => rx.test(urlPath));

const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return next();

  const urlPath = req.originalUrl || req.url || req.path;
  if (isWhitelisted(urlPath)) return next();

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    log.fatal().server("JWT_SECRET must be defined in environment variables.");
    return res.fail(null, {
      message: "Server misconfiguration: missing JWT secret.",
      code: StatusCode.INTERNAL_SERVER_ERROR,
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.fail(null, {
      message: "Access token missing or malformed.",
      code: StatusCode.UNAUTHORIZED,
    });
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUserPayload;
    req.authenticatedUser = decoded;
    return next();
  } catch {
    return res.fail(null, {
      message: "Invalid or expired access token.",
      code: StatusCode.UNAUTHORIZED,
    });
  }
};

export default authenticateMiddleware;
