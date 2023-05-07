import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		// проверяем есть ли в req user
		// если есть, то значит пользователь есть, значит пропускаем дальше
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Вы не авторизован' });
	}
}