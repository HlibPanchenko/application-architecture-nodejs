import { LoggerService } from "../logger/logger.service";
import { Response } from "express";
import { Router } from "express";
import { IControllerRoute } from "./route.interface";
import { ILogger } from "../logger/logger.interface";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export abstract class BaseController {
  // readonly - чтобы мы не могли его менять
  // пишем с "_" потому что будем делать геттеры и сеттеры для него
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  // getter
  get router() {
    return this._router;
  }

  public send<T>(res: Response, code: number, messsage: T) {
    res.type("application/json");
    return res.status(code).json(messsage);
  }

  public ok<T>(res: Response, messsage: T) {
    return this.send<T>(res, 200, messsage);
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  // метод который сделает биндинг функций которые находятся в классе к некоторым роутам
  // protected - не сможем вызывать с экземпляра класса, но сможем из наследника
  // передаем роуты которые хотим биндить
  protected bindRoutes(routes: IControllerRoute[]) {
    // должны пройтись циклом по всем роутам и забиндить каждый роут
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);
      // привяжем контекст для каждого middleware
      const middleware = route.middlewares?.map((m) => m.execute.bind(m));
      // привяжем контекст
      const handler = route.func.bind(this);
      // если есть мидлвейры, тогда все выполнится в порядке описаному 
      //в массиве [...middleware, handler]
      const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
      // this.router[route.method](route.path, handler);
    }
  }
}
