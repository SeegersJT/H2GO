// utils/RouteLoader.util.ts

import fs from "fs";
import path from "path";
import log from "./Logger";
import { Router } from "express";

const routesDir = path.join(__dirname, "..", "routes");

const walkRoutes = async (dir: string, router: Router): Promise<void> => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await walkRoutes(fullPath, router);
    } else if (stat.isFile() && file.endsWith(".route.ts")) {
      const routePath = getRoutePath(routesDir, fullPath);

      const routeModule = await import(fullPath);
      const nestedRouter: Router = routeModule.default;

      if (nestedRouter && typeof nestedRouter === "function") {
        router.use(routePath, nestedRouter);
        log.mount().route(`Route mounted: [${routePath}] → ${fullPath}`);
      } else {
        log.warn().route(`Invalid router export in ${fullPath}`);
      }
    }
  }
};

const getRoutePath = (routesDir: string, fullPath: string): string => {
  const relativeDir = path.relative(routesDir, path.dirname(fullPath));
  const normalized = relativeDir.split(path.sep).join("/");
  return "/" + normalized;
};

export const buildRouter = async (): Promise<Router> => {
  try {
    log.info().route("Initializing route mounting...");
    const router = Router();
    await walkRoutes(routesDir, router);

    log.success().route("Route mounting completed.");
    return router;
  } catch (error) {
    log.fatal().route("Route mounting failed:", error);
    process.exit(1);
  }
};
