import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authenticateMiddleware from "./middleware/Authenticate.middleware";
import errorHandlingMiddleware from "./middleware/ErrorHandling.middleware";
import { responseMiddleware } from "./middleware/Response.middleware";
import { initCommunicationProviders } from "./services/Communication.service";
import { buildRouter } from "./utils/RouteLoader.util";

dotenv.config({ quiet: true });

if (!process.env.TZ) {
  process.env.TZ = "Africa/Johannesburg";
}

export const setupApp = async () => {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: true, credentials: true }));
  app.use(morgan("dev"));

  app.use(responseMiddleware);
  app.use(authenticateMiddleware);

  initCommunicationProviders();

  const router = await buildRouter();

  app.use(router);

  app.use(errorHandlingMiddleware);

  return app;
};
