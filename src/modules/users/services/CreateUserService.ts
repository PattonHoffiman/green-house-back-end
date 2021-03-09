import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<void> {
    const checkExistentUser = await this.usersRepository.findByEmail(email);

    if (checkExistentUser) throw new AppError('E-mail already exists!', 409);

    const hashedPassword = await this.hashProvider.generateHash(password);

    await this.usersRepository.create(name, email, hashedPassword);
  }
}
