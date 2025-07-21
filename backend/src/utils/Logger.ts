import chalk from "chalk";
import stringWidth from "string-width";

type LogType = "success" | "info" | "warn" | "error" | "fatal" | "debug" | "mount";
type Category = "database" | "server" | "auth" | "api" | "general" | "route";

const emojis: Record<LogType, string> = {
  success: "✅",
  info: "📰",
  warn: "⚠️",
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
const EMOJI_WIDTH = 3; // visual width in terminal columns you want to allocate

function padEmoji(emoji: string, width: number) {
  const len = stringWidth(emoji);
  if (len >= width) return emoji;
  return emoji + " ".repeat(width - len);
}

class Logger {
  private _type: LogType = "info";

  private log(category: Category, message: string | Error, ...optional: unknown[]) {
    const now = new Date().toISOString();
    const emoji = padEmoji(emojis[this._type], EMOJI_WIDTH);
    const color = colors[this._type];

    const msg = message instanceof Error ? message.message : message;
    const categoryStr = `${category.toUpperCase()}`.padEnd(CATEGORY_WIDTH);
    const typeStr = `${this._type.toUpperCase()}`.padEnd(TYPE_WIDTH);

    // eslint-disable-next-line no-console
    console.log(
      color(`[${now}] ${emoji} | ${categoryStr} | ${typeStr} ${msg}`),
      optional.length > 0 ? "\n\n" : "",
      ...optional,
      optional.length > 0 ? "\n\n" : ""
    );

    this._type = "info";
  }

  success() {
    this._type = "success";
    return this.categoryMethods();
  }

  info() {
    this._type = "info";
    return this.categoryMethods();
  }

  warn() {
    this._type = "warn";
    return this.categoryMethods();
  }

  error() {
    this._type = "error";
    return this.categoryMethods();
  }

  fatal() {
    this._type = "fatal";
    return this.categoryMethods();
  }

  debug() {
    this._type = "debug";
    return this.categoryMethods();
  }

  mount() {
    this._type = "mount";
    return this.categoryMethods();
  }

  custom(type: LogType, category: Category, message: string | Error, ...optional: unknown[]) {
    this._type = type;
    this.log(category, message, ...optional);
  }

  private categoryMethods() {
    return {
      database: this.log.bind(this, "database"),
      server: this.log.bind(this, "server"),
      auth: this.log.bind(this, "auth"),
      api: this.log.bind(this, "api"),
      general: this.log.bind(this, "general"),
      route: this.log.bind(this, "route"),
    };
  }
}

const log = new Logger();
export default log;
