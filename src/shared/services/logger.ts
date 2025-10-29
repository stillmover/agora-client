type LogLevel = "debug" | "info" | "warn" | "error";

type LoggerConfig = {
  enabled: boolean;
  level: LogLevel;
};

const DEFAULT_CONFIG: LoggerConfig = {
  enabled: true,
  level: "info",
};

class Logger {
  private config: LoggerConfig;

  constructor(config?: LoggerConfig) {
    this.config = config ?? DEFAULT_CONFIG;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const levels: Record<LogLevel, number> = {
      debug: 0,
      error: 3,
      info: 1,
      warn: 2,
    };

    return levels[level] >= levels[this.config.level];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
  }

  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const logger = new Logger({
  enabled: import.meta.env.DEV,
  level: import.meta.env.DEV ? "debug" : "error",
});

export type ILogger = Pick<Logger, "debug" | "info" | "warn" | "error">;
