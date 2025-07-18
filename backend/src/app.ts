import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.config';
import router from './utils/RouteLoader.util';
import { authenticationMiddleware } from './middleware/Authentication.middleware';
import { responseMiddleware } from './middleware/Response.middleware';
import errorHandlingMiddleware from './middleware/ErrorHandling.middleware';

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(authenticationMiddleware)
app.use(responseMiddleware)

app.use(router);

app.use(errorHandlingMiddleware)

connectDB();

export default app;
