import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/constants/StatusCode.constant";
import log from "../utils/Logger";
import { AuthenticatedUserPayload } from "../types/AuthenticatedUserPayload";

type MatchKind = "exact" | "prefix";

interface WhitelistRule {
  path: string;
  kind: MatchKind;
}

function getPathOnly(urlPath: string): string {
  const base = urlPath.split("?")[0].split("#")[0].toLowerCase();

  if (base.length > 1 && base.endsWith("/")) return base.slice(0, -1);
  return base;
}

const STATIC_WHITELIST: WhitelistRule[] = [
  { path: "/api/v1/health", kind: "exact" },
  { path: "/api/v1/auth", kind: "prefix" },
];

function loadEnvWhitelist(): WhitelistRule[] {
  const raw = process.env.AUTH_WHITELIST;
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map<WhitelistRule>((p) => ({
      path: getPathOnly(p),
      kind: "prefix",
    }));
}

const WHITELIST: WhitelistRule[] = [...STATIC_WHITELIST, ...loadEnvWhitelist()];

function isWhitelisted(urlPath: string): boolean {
  const p = getPathOnly(urlPath);

  for (const rule of WHITELIST) {
    if (rule.kind === "exact") {
      if (p === getPathOnly(rule.path)) return true;
    } else {
      const base = getPathOnly(rule.path);
      if (p === base || p.startsWith(base + "/")) return true;
    }
  }
  return false;
}

const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    next();
    return;
  }

  const urlPath = req.originalUrl || req.url || req.path;
  if (isWhitelisted(urlPath)) {
    next();
    return;
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    log.fatal().server("JWT_SECRET must be defined in environment variables.");
    res.error(null, {
      message: "Server misconfiguration: missing JWT secret.",
      code: StatusCode.INTERNAL_SERVER_ERROR,
    });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.error(null, {
      message: "Access token missing or malformed.",
      code: StatusCode.UNAUTHORIZED,
    });
    return;
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUserPayload;
    req.authenticatedUser = decoded;
    next();
  } catch {
    res.error(null, {
      message: "Invalid or expired access token.",
      code: StatusCode.UNAUTHORIZED,
    });
  }
};

export default authenticateMiddleware;
