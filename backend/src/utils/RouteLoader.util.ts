import fs from "fs";
import path from "path";
import { Router } from "express";
import log from "./Logger";

const router = Router();

const routesDir = path.join(__dirname, "..", "routes");

const walkRoutes = async (dir: string): Promise<void> => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await walkRoutes(fullPath);
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

(async () => {
  await walkRoutes(routesDir);
})();

export default router;
