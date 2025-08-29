import { setupApp } from "./app";
import connectDB from "./config/Database.config";
import { StatusCode } from "./utils/constants/StatusCode.constant";
import { HttpError } from "./utils/HttpError";
import log from "./utils/Logger";

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new HttpError("MONGODB_URI missing", StatusCode.INTERNAL_SERVER_ERROR);
    }

    await connectDB();

    const app = await setupApp();

    const server = app.listen(PORT, () => {
      log.success().server(`Server running on http://localhost:${PORT}`);
    });

    const shutdown = (sig: string) => () => {
      log.warn().server(`${sig} received. Shutting down...`);
      server.close(() => process.exit(0));
    };
    process.on("SIGINT", shutdown("SIGINT"));
    process.on("SIGTERM", shutdown("SIGTERM"));
  } catch (err) {
    log.fatal().server("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
