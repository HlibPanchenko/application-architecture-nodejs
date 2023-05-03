import { Logger, ILogObj } from "tslog";

export interface ILogger {
  logger: Logger<ILogObj>; // тип

  // не знаем какого типа будут аргументы
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
}
