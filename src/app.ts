import express, { Express } from "express"; // Express - это interface описывающий приложение
// import { userRouter } from "./users/users.js";
import { Server } from "http"; // тип Сервера
import { inject, injectable } from "inversify";
import { ExeptionFilter } from "./errors/exeption.filter.js";
import { ILogger } from "./logger/logger.interface.js";
import { LoggerService } from "./logger/logger.service.js";
import { TYPES } from "./types.js";
import { UserController } from "./users/users.controller.js";
import 'reflect-metadata'

@injectable()
export class App {
  // типы
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter
  ) {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  // метод иницилизации нашего приложения
  public async init() {
    this.useRoutes();
    this.useExceptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http//localhost:${this.port}`);
    //  console.log(`Сервер запущен на http//localhost:${this.port}`);
  }
}
