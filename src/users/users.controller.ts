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
import { sign } from 'jsonwebtoken';
import { IUserService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';


@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: LoggerService,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
		// мы бы помгли тут писать res.send, но будем использовать наши кастомые методы
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'ошибка авторизации', 'login'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
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

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		// возвращаем больше инфы о пользователе чем раньше
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
		// до этого мы просто возвращали почту пользователя
		// this.ok(res, { email: user });
	}

	// принимает данные которые мы хотим зашифровать и секрет
	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				// если все ок, вернем токен
				(err, token) => {
					if (err) {
						reject(err);
					}
					// у нас токен может быть либо string либо undefined, поэтому явно укажем что он строка
					// может быть undefined, когда у нас отработает сценарий ошибки
					resolve(token as string);
				},
			);
		});
	}
}
