/* eslint-disable @typescript-eslint/no-require-imports */
// utils/RouteLoader.util.ts
import fs from "fs";
import path from "path";
import log from "./Logger";
import { Router } from "express";
import { HttpError } from "./HttpError";
import { StatusCode } from "./constants/StatusCode.constant";

const DEFAULT_ROUTES_DIR = path.join(__dirname, "..", "routes");
const routesDir = process.env.ROUTES_DIR
  ? path.isAbsolute(process.env.ROUTES_DIR)
    ? process.env.ROUTES_DIR
    : path.join(process.cwd(), process.env.ROUTES_DIR)
  : DEFAULT_ROUTES_DIR;

const ROUTE_FILE_REGEX = /\.route\.(ts|js|mjs|cjs)$/i;
const IGNORE_FILE_REGEX = /\.(d\.ts|map)$/i;

const dynamicLoad = async (absPath: string) => {
  // Prefer dynamic import with a plain absolute path (works in Node 20 for CJS builds once transpiled)
  try {
    // Normalize to POSIX-style separators just in case
    const spec = absPath.replace(/\\/g, "/");
    return await import(spec);
  } catch (e1: any) {
    // In CJS builds, TS transforms import() to require() — but if the above still fails, try require directly
    try {
      return require(absPath);
    } catch (e2: any) {
      const msg1 = e1?.message || e1;
      const msg2 = e2?.message || e2;
      throw new HttpError(`import() failed: ${msg1}; require() failed: ${msg2}`, StatusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

const walkRoutes = async (dir: string, router: Router, mounted: string[]): Promise<void> => {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    log.warn().route(`Routes directory not found or unreadable: ${dir}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);

    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      log.warn().route(`Skipping unreadable entry: ${fullPath}`);
      continue;
    }

    if (stat.isDirectory()) {
      await walkRoutes(fullPath, router, mounted);
      continue;
    }
    if (!stat.isFile()) continue;

    if (IGNORE_FILE_REGEX.test(entry)) continue;
    if (!ROUTE_FILE_REGEX.test(entry)) continue;

    const routePath = getRoutePath(routesDir, fullPath);

    try {
      const routeModule = await dynamicLoad(fullPath);
      const nestedRouter: any = routeModule?.default ?? routeModule;

      // Express Router has a .use function
      if (nestedRouter && typeof nestedRouter.use === "function") {
        router.use(routePath, nestedRouter as Router);
        mounted.push(`${routePath} ← ${fullPath}`);
        log.mount().route(`Route mounted: [${routePath}] ← ${fullPath}`);
      } else {
        log.warn().route(`Invalid router export (no .use function) in ${fullPath}`);
      }
    } catch (err: any) {
      log.warn().route(`Failed to import ${fullPath}: ${err?.message || err}`);
    }
  }
};

const getRoutePath = (routesRoot: string, fullPath: string): string => {
  const relativeDir = path.relative(routesRoot, path.dirname(fullPath));
  const normalized = relativeDir.split(path.sep).filter(Boolean).join("/");
  // e.g. routes/api/v1/health/Health.route.js -> /api/v1/health
  return "/" + (normalized || "");
};

export const buildRouter = async (): Promise<Router> => {
  const router = Router();
  try {
    log.info().route(`Initializing route mounting... (from: ${routesDir})`);
    const mounted: string[] = [];
    await walkRoutes(routesDir, router, mounted);

    if (mounted.length === 0) {
      log.warn().route(`No routes were mounted. Looking for ".route.(ts|js|mjs|cjs)" under ${routesDir}.`);
    } else {
      log.success().route(`Route mounting completed. Mounted ${mounted.length} route group(s).`);
    }
    return router;
  } catch (error) {
    log.fatal().route("Route mounting failed:", error);
    process.exit(1);
  }
};
