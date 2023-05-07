import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		// получаем соль из файла .env!!!
		const salt = this.configService.get('SALT');
		console.log(salt);

		await newUser.setPassword(password, Number(salt));

		// проверка что он есть?
		// если есть - возвращаем null
		// если нет - создаём
		// return null;

		// ищем пользователя по почте
		const existedUser = await this.usersRepository.find(email);
		// если такой пользователь уже зареган по такой почте
		if (existedUser) {
			return null;
		}
		// иначе создадим и вернем нового пользователя (его модель)
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		// найдем пользователя у кого такой же имейл
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		// если такой user есть, то конструрируем его 
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		// сравниаем наш пароль (при логине) с паролем в бд (при регистрации)
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}
}
