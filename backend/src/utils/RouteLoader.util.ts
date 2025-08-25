/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/RouteLoader.util.ts
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import log from "./Logger";
import { Router } from "express";

const DEFAULT_ROUTES_DIR = path.join(__dirname, "..", "routes");
const routesDir = process.env.ROUTES_DIR
  ? path.isAbsolute(process.env.ROUTES_DIR)
    ? process.env.ROUTES_DIR
    : path.join(process.cwd(), process.env.ROUTES_DIR)
  : DEFAULT_ROUTES_DIR;

const ROUTE_FILE_REGEX = /\.route\.(ts|js|mjs|cjs)$/i;
const IGNORE_FILE_REGEX = /\.(d\.ts|map)$/i;

const importModule = async (absPath: string) => {
  // Use file:// URL to make dynamic import reliable across CJS/ESM and OSes
  const href = pathToFileURL(absPath).href;
  return await import(href);
};

const walkRoutes = async (dir: string, router: Router, mounted: string[]): Promise<void> => {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(dir);
  } catch (e) {
    log.warn().route(`Routes directory not found or unreadable: ${dir}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      log.warn().route(`Skipping unreadable entry: ${fullPath}`);
      continue;
    }

    if (stat.isDirectory()) {
      await walkRoutes(fullPath, router, mounted);
      continue;
    }

    if (!stat.isFile()) continue;

    if (IGNORE_FILE_REGEX.test(entry)) {
      // Skip type definition & sourcemaps
      continue;
    }

    if (!ROUTE_FILE_REGEX.test(entry)) {
      // Not a route file; skip
      continue;
    }

    const routePath = getRoutePath(routesDir, fullPath);

    try {
      const routeModule = await importModule(fullPath);
      // Handle CommonJS and ESM default exports
      const nestedRouter: any = routeModule?.default ?? routeModule;

      if (nestedRouter && typeof nestedRouter.use === "function") {
        router.use(routePath, nestedRouter as Router);
        mounted.push(`${routePath} ← ${fullPath}`);
        log.mount().route(`Route mounted: [${routePath}] ← ${fullPath}`);
      } else {
        log.warn().route(`Invalid router export (no .use function) in ${fullPath}`);
      }
    } catch (err: any) {
      log.warn().route(`Failed to import ${fullPath}: ${(err && err.message) || err}`);
    }
  }
};

const getRoutePath = (routesRoot: string, fullPath: string): string => {
  // Mount by directory (e.g., routes/users/index.route.js => /users)
  const relativeDir = path.relative(routesRoot, path.dirname(fullPath));
  const normalized = relativeDir.split(path.sep).filter(Boolean).join("/");
  return "/" + (normalized || ""); // "" becomes "/" for root routes
};

export const buildRouter = async (): Promise<Router> => {
  const router = Router();
  try {
    log.info().route(`Initializing route mounting... (from: ${routesDir})`);

    const mounted: string[] = [];
    await walkRoutes(routesDir, router, mounted);

    if (mounted.length === 0) {
      log.warn().route(`No routes were mounted. Checked for files matching ".route.(ts|js|mjs|cjs)" under ${routesDir}.`);
    } else {
      log.success().route(`Route mounting completed. Mounted ${mounted.length} route group(s).`);
    }

    return router;
  } catch (error) {
    log.fatal().route("Route mounting failed:", error);
    process.exit(1);
  }
};
