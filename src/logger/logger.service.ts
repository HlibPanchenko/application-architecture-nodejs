import { Logger, ILogObj } from "tslog";

export class LoggerService {
  public logger: Logger<ILogObj>; // тип

  constructor() {
    // cоздаем логгер
    this.logger = new Logger<ILogObj>({ name: "myLogger" });
  }

  // не знаем какого типа будут аргументы
  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
}

// const myLog = new LoggerService()
// myLog.logger
