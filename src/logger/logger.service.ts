import { injectable } from "inversify";
import { Logger, ILogObj } from "tslog";
import { ILogger } from "./logger.interface";
import 'reflect-metadata'

// injectable говорит, что этот класс можно положить в контейнер
@injectable()
export class LoggerService implements ILogger {
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
