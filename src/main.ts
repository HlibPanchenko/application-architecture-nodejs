import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.service.interface";
import { ExeptionFilter } from "./errors/exeption.filter";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { TYPES } from "./types";
import { UserController } from "./users/users.controller";
import { UserService } from "./users/users.service";
import { IUserService } from "./users/users.service.interface";
import { IUserController } from "./users/uses.controller.interface";

// async function bootstrap() {
//   // до этого мы все зависимости внедряли делали вручную
//   // const app = new App(
//   //   new LoggerService(),
//   //   new UserController(new LoggerService()),
//   //   new ExeptionFilter(new LoggerService())
//   // ); // передаем экземпляр
//   // await app.init();
// }

// bootstrap();

// Сделаем новый контейнер модуль.
// Теперь все биндинги внутри одного модуля
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
  // сделаем контейнер
  // контейнер - это некая коробка, в которую мы будем складывать биндинги символов, а потом буде переиспользовать
  const appContainer = new Container();
  // Забиндим типы в контейнер
  // загрузим существующие биндинги
  appContainer.load(appBindings);
  // с помощью get получаем экземпляр нашего класса App
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
  return { app, appContainer };
}

export const { app, appContainer } = bootstrap();

// Вариант до того как мы сложили все биндинги в модуль
// Забиндим типы в контейнер
// должны контенйеру указать биндинги того, что хотим реализовать
// в <> указываем какой интерфейс будем биндить
// to - будем биндить на LoggerService
// TYPES.ILogger - символ связи
// Если мы будем гдето делать инджект по токену TYPES.ILogger, то
// мы должны вязть экземпляр LoggerService и положить туда

// We put everything in контейнер модуль
// appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
// appContainer.bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
// appContainer.bind<UserController>(TYPES.UserController).to(UserController);
// appContainer.bind<App>(TYPES.Application).to(App);

// с помощью get получаем экземпляр нашего класса App
// const app = appContainer.get<App>(TYPES.Application);
// app.init();

// export { app, appContainer };
