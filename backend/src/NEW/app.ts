import dotenv from "dotenv";
import express from "express";
import errorHandlingMiddleware from "./middleware/ErrorHandling.middleware";
import { responsesMiddleware } from "./middleware/Response.middleware";
import { buildRouter } from "./utils/RouteLoader.util";
import authenticateMiddleware from "./middleware/Authenticate.middleware";

dotenv.config({ quiet: true });

export const setupApp = async () => {
  const app = express();
  app.use(express.json());

  app.use(responsesMiddleware);
  app.use(authenticateMiddleware);

  const router = await buildRouter();
  app.use(router);

  app.use(errorHandlingMiddleware);

  return app;
};
