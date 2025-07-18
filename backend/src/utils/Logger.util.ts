import winston from 'winston';
import chalk from 'chalk';

const LABEL_WIDTH = 8;

const padLabel = (label: string): string => `${label}`.padEnd(LABEL_WIDTH);

const colorizeLabel = (label: string) => {
  const padded = padLabel(label.toUpperCase());
  switch (label.toUpperCase()) {
    case 'SERVER': return chalk.cyan.bold(padded);
    case 'MONGODB': return chalk.green.bold(padded);
    case 'ERROR': return chalk.red.bold(padded);
    case 'WARNING': return chalk.yellow.bold(padded);
    case 'ROUTER': return chalk.magenta.bold(padded);
    default: return chalk.white.bold(padded);
  }
};

const colorizeLevel = (level: string) => {
  switch (level) {
    case 'info': return chalk.blue(level.toUpperCase());
    case 'warn': return chalk.yellow(level.toUpperCase());
    case 'error': return chalk.red(level.toUpperCase());
    default: return chalk.white(level.toUpperCase());
  }
};

const customFormat = winston.format.printf((info) => {
  const timestamp = info.timestamp as string;
  const level = info.level as string;
  const message = info.message as string;
  const label = info.label as string;
  const emoji = info.emoji as string | undefined;

  return `${chalk.gray(timestamp)} ${emoji || ''} | ${colorizeLabel(label)} | ${colorizeLevel(level)}: ${message}`;
});

const baseLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    customFormat
  ),
  transports: [new winston.transports.Console()],
});

// Dynamic tagged logger
const log = {
  tag: (label: string, emoji = '') => ({
    info: (msg: string) => baseLogger.info({ label, emoji, message: msg }),
    warn: (msg: string) => baseLogger.warn({ label, emoji, message: msg }),
    error: (msg: string) => baseLogger.error({ label, emoji, message: msg }),
  }),
};

export default log;
