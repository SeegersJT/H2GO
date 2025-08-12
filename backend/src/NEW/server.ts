import { setupApp } from "./app";
import connectDB from "./config/Database.config";
import log from "./utils/Logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const app = await setupApp();

    app.listen(PORT, () => {
      log.success().server(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    log.fatal().server("Failed to start server: DB connection failed", err);
    process.exit(1);
  }
};

startServer();
