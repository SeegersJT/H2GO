import chalk from "chalk";
import stringWidth from "string-width";

type LogType = "success" | "info" | "warn" | "error" | "fatal" | "debug" | "mount";
type Category = "database" | "server" | "auth" | "api" | "general" | "route";

const emojis: Record<LogType, string> = {
  success: "✅",
  info: "📰",
  warn: "🔕",
  error: "❌",
  fatal: "💀",
  debug: "🐛",
  mount: "🦄",
};

const colors: Record<LogType, (text: string) => string> = {
  success: chalk.green,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.bgRed.white.bold,
  debug: chalk.magenta,
  mount: chalk.cyan,
};

const CATEGORY_WIDTH = 11;
const TYPE_WIDTH = 9;
const EMOJI_WIDTH = 3;

const levelPriority: Record<LogType, number> = {
  debug: 10,
  info: 20,
  success: 20,
  mount: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

function padEmoji(emoji: string, width: number) {
  const len = stringWidth(emoji);
  if (len >= width) return emoji;
  return emoji + " ".repeat(width - len);
}

class Logger {
  private _type: LogType = "info";

  private level: LogType;

  constructor() {
    const envLevel = process.env.LOG_LEVEL as LogType;
    this.level = levelPriority[envLevel] ? envLevel : "info";
  }

  private shouldLog(type: LogType) {
    return levelPriority[type] >= levelPriority[this.level];
  }

  private log(type: LogType, category: Category, message: string | Error, ...optional: any[]) {
    if (!this.shouldLog(type)) return;

    const now = new Date().toISOString();
    const emoji = padEmoji(emojis[type], EMOJI_WIDTH);
    const color = colors[type];

    const msg = message instanceof Error ? message.message : message;
    const categoryStr = `${category.toUpperCase()}`.padEnd(CATEGORY_WIDTH);
    const typeStr = `${this._type.toUpperCase()}`.padEnd(TYPE_WIDTH);

    // eslint-disable-next-line no-console
    console.log(
      color(`[${now}] ${emoji} | ${categoryStr} | ${typeStr} | ${msg}`),
      optional.length > 0 ? "\n\n" : "",
      ...optional,
      optional.length > 0 ? "\n\n" : ""
    );
  }

  private categoryMethods(type: LogType) {
    return {
      database: this.log.bind(this, type, "database"),
      server: this.log.bind(this, type, "server"),
      auth: this.log.bind(this, type, "auth"),
      api: this.log.bind(this, type, "api"),
      general: this.log.bind(this, type, "general"),
      route: this.log.bind(this, type, "route"),
    };
  }

  success() {
    return this.categoryMethods("success");
  }

  info() {
    return this.categoryMethods("info");
  }

  warn() {
    return this.categoryMethods("warn");
  }

  error() {
    return this.categoryMethods("error");
  }

  fatal() {
    return this.categoryMethods("fatal");
  }

  debug() {
    return this.categoryMethods("debug");
  }

  mount() {
    return this.categoryMethods("mount");
  }

  custom(type: LogType, category: Category, message: string | Error, ...optional: any[]) {
    this.log(type, category, message, ...optional);
  }
}

const log = new Logger();
export default log;
