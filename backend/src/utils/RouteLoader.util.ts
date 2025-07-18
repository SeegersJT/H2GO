import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import log from './Logger.util';

const router = Router();

const routesDir = path.join(__dirname, '..', 'routes');

const walkRoutes = (dir: string) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkRoutes(fullPath);
    } else if (stat.isFile() && file.endsWith('.route.ts')) {
      const routePath = getRoutePath(routesDir, fullPath);
      const routeModule = require(fullPath);
      const nestedRouter: Router = routeModule.default;

      if (nestedRouter && typeof nestedRouter === 'function') {
        router.use(routePath, nestedRouter);
        log.tag('ROUTER', '🧭').info(`Route mounted: [${routePath}] → ${fullPath}`)
      } else {
        log.tag('ROUTER', '⚠️').warn(`Invalid router export in ${fullPath}`)
      }
    }
  });
};

const getRoutePath = (routesDir: string, fullPath: string): string => {
  const relativeDir = path.relative(routesDir, path.dirname(fullPath));
  const normalized = relativeDir.split(path.sep).join('/');
  return '/' + normalized;
};

walkRoutes(routesDir);

export default router;
