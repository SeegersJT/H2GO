import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/Database.config";
import errorHandlingMiddleware from "./middleware/ErrorHandling.middleware";
import { responsesMiddleware } from "./middleware/Response.middleware";
import router from "./utils/RouteLoader.util";
import log from "./utils/Logger";

dotenv.config();

const app = express();
app.use(express.json());

app.use(responsesMiddleware);

app.use(router);

app.use(errorHandlingMiddleware);

connectDB();

export default app;
