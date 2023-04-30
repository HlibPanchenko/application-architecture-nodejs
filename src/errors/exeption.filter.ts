import { Request, Response, NextFunction } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";

export class ExeptionFilter implements IExeptionFilter {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  // HTTPError - наш кастомный
  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
	// проверяем есть ли у нас HTTPError
    if (err instanceof HTTPError) {
      this.logger.error(
        ` [${err.context}] Ошибка ${err.statusCode} : ${err.message}`
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
    }
    this.logger.error(`${err.message}`);
    res.status(500).send({ err: err.message });
  }
}
