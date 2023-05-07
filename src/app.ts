import express, { Express } from 'express'; // Express - это interface описывающий приложение
// import { userRouter } from "./users/users.js";
import { Server } from 'http'; // тип Сервера
import { inject, injectable } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filter.js';
import { ILogger } from './logger/logger.interface.js';
import { LoggerService } from './logger/logger.service.js';
import { TYPES } from './types.js';
import { UserController } from './users/users.controller.js';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IUserController } from './users/uses.controller.interface.js';
import { IExeptionFilter } from './errors/exeption.filter.interface.js';
import { PrismaService } from './database/prisma.service.js';
import { AuthMiddleware } from './common/auth.middleware.js';

@injectable()
export class App {
	// типы
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware() {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes() {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	// метод иницилизации нашего приложения
	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect(); // connect to db
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http//localhost:${this.port}`);
		//  console.log(`Сервер запущен на http//localhost:${this.port}`);
	}
}
