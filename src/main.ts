import { App } from "./app";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";

async function bootstrap() {
  const app = new App(
    new LoggerService(),
    new UserController(new LoggerService())
  ); // передаем экземпляр
  await app.init();
}

bootstrap();
