import app from './app';
import log from './utils/Logger.util';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => log.tag('SERVER', '🚀').info(`Server Started on port: ${PORT}`))
