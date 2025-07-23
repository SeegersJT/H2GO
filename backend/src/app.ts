import dotenv from "dotenv";
import express from "express";
import errorHandlingMiddleware from "./middleware/ErrorHandling.middleware";
import { responsesMiddleware } from "./middleware/Response.middleware";
import { buildRouter } from "./utils/RouteLoader.util";

dotenv.config({ quiet: true });

export const setupApp = async () => {
  const app = express();
  app.use(express.json());

  app.use(responsesMiddleware);

  const router = await buildRouter();
  app.use(router);

  app.use(errorHandlingMiddleware);

  return app;
};
