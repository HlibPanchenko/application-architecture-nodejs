import express, { Express } from "express"; // Express - это interface описывающий приложение
import { userRouter } from "./users/users.js";
import { Server } from "http"; // тип Сервера
import { LoggerService } from "./logger/logger.service.js";

export class App {
  // типы
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService

  constructor(logger:LoggerService) {
    this.app = express();
    this.port = 8000;
	 this.logger = logger // создаем экземпляр класса 
  }

  useRoutes() {
    this.app.use("/users", userRouter);
  }

  // метод иницилизации нашего приложения
  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http//localhost:${this.port}`);
   //  console.log(`Сервер запущен на http//localhost:${this.port}`);
  }
}
 