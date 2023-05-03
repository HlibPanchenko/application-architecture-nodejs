import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { Request, Response, NextFunction } from "express";
import { HTTPError } from "../errors/http-error.class";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import 'reflect-metadata'
import { IUserController } from "./uses.controller.interface";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(@inject(TYPES.ILogger) private loggerService: LoggerService) {
    super(loggerService);
    this.bindRoutes([
      { path: "/register", method: "post", func: this.register },
      { path: "/login", method: "post", func: this.login },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    // мы бы помгли тут писать res.send, но будем использовать наши кастомые методы
    //  this.ok(res, "login");
	 // имитируем ошибку
    next(new HTTPError(401, "Ошибка авторизации"));
  }

  register(req: Request, res: Response, next: NextFunction) {
     this.ok(res, "register");
   //  next(new HTTPError(401, "Ошибка авторизации"));
  }
}
