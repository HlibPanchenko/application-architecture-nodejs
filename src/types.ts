// сделаем символы ждя всех клмпонентов, которые будем связывать
export const TYPES = {
  Application: Symbol.for("Application"), // для App
  ILogger: Symbol.for("ILogger"), // для логгера
  UserController: Symbol.for("UserController"), // для контроллера
  UserService: Symbol.for('UserService'),
  ExeptionFilter: Symbol.for("ExeptionFilter"),
  ConfigService: Symbol.for('ConfigService'),
  PrismaService: Symbol.for('PrismaService'),
  UsersRepository: Symbol.for('UsersRepository'),
};
