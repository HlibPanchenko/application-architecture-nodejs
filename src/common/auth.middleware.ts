import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		// получим headers.
		if (req.headers.authorization) {
			// достаним из headers сам токен, убрав слово Bearer
			// с помощью verify проверяем соответствие токена секрету
			// если все хорошо, он расшифрует нам наш payload, который мы передали
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload === 'object' && 'email' in payload) {
					// обогащаем req дополнительными данными
					// req.user = payload.email;
					req.user = (payload as JwtPayload).email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
