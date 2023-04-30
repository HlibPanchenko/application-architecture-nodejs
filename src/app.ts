import express, { Express } from "express"; // Express - это interface описывающий приложение
// import { userRouter } from "./users/users.js";
import { Server } from "http"; // тип Сервера
import { ExeptionFilter } from "./errors/exeption.filter.js";
import { LoggerService } from "./logger/logger.service.js";
import { UserController } from "./users/users.controller.js";

export class App {
  // типы
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService;
  userController: UserController;
  exeptionFilter: ExeptionFilter;

  constructor(
    logger: LoggerService,
    userController: UserController,
    exeptionFilter: ExeptionFilter
  ) {
    this.app = express();
    this.port = 8000;
    this.logger = logger; // создаем экземпляр класса
    this.userController = userController;
    this.exeptionFilter = exeptionFilter;
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
