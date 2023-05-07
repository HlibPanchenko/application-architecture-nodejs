//храним наши кастомные типы

// дополним интерфейс Request
declare namespace Express {
	export interface Request {
		user: string;
	}
}
