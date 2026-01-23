import morgan from "morgan";
import log from "../utils/Logger";

/**
 * Morgan → Custom Logger bridge
 * Routes all HTTP request logs through our formatter
 */
const httpLoggerMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream: {
    write: (message: string) => {
      const msg = message.trim();

      // Extract status code (simple + fast)
      const statusMatch = msg.match(/\s(\d{3})\s/);
      const status = statusMatch ? Number(statusMatch[1]) : 0;

      if (status >= 500) {
        log.error().api(msg);
      } else if (status >= 400) {
        log.warn().api(msg);
      } else {
        log.info().api(msg);
      }
    },
  },

  // Optional: silence ultra-noisy routes
  skip: (req) => req.url?.includes("/health") === true || req.url?.includes("/auth/refresh-token") === true,
});

export default httpLoggerMiddleware;
