import app from "./app";
import log from "./utils/Logger";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  log.info().server(`Server running on http://localhost:${PORT}`);
});
