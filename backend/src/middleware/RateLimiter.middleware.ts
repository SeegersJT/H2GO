import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/constants/StatusCode.constant";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  /**
   * Optional function to derive a unique key for a request. If it returns
   * `undefined`, the middleware will fall back to the request IP address.
   */
  keyGenerator?: (req: Request) => string | undefined;
}

export const createRateLimiter = ({ windowMs, max, keyGenerator }: RateLimitOptions) => {
  const hits = new Map<string, { count: number; expires: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator?.(req) ?? req.ip ?? "unknown";
    const now = Date.now();
    const record = hits.get(key);

    if (!record || record.expires <= now) {
      hits.set(key, { count: 1, expires: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      res.error(null, {
        message: "Too many requests",
        code: StatusCode.TOO_MANY_REQUESTS,
      });
      return;
    }

    record.count += 1;
    return next();
  };
};
