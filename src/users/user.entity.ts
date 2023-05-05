import { compare, hash } from 'bcryptjs';

// Сделаем entity для User
export class User {
	// _password не передаем в конструткор, потому что
	// мы не хотим хранить пароль в открытом виде в БД
	private _password: string;

	// Конструрируем пользователя сразу с хешированным паролем
	constructor(
		private readonly _email: string,
		private readonly _name: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	// хешируем пароль
	// не можем сделать сеттер, так как он не может быть асинхронным
	// кладем уже захешированный пароль в нашего пользователя
	public async setPassword(pass: string, salt: number): Promise<void> {
		// второй параметр - соль
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		// сравниваем хеш и исходный парль
		// функция compare с библиотеки bcryptjs
		return compare(pass, this._password);
	}
}
