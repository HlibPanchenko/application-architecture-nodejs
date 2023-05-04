import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './uses.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserService } from './users.service';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: LoggerService,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
		// мы бы помгли тут писать res.send, но будем использовать наши кастомые методы
		//  this.ok(res, "login");
		// имитируем ошибку
		console.log(req.body);
		next(new HTTPError(401, 'Ошибка авторизации'));
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// // Создадим нового пользователя (потом вынесем эту логику в сервис)
		// const newUser = new User(req.body.email, req.body.name);
		// // добавим хешированный пароль пользователю
		// await newUser.setPassword(req.body.password);
		// console.log(req.body);

		// Теперь userService который мы заинжектили в конструкторе, мы можем использовать
		const result = await this.userService.createUser(req.body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.ok(res, result);
		// this.ok(res, newUser);
		//  next(new HTTPError(401, "Ошибка авторизации"));
	}
}
