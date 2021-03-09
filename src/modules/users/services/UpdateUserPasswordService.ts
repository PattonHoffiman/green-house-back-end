import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUpdatePasswordDTO from '../dtos/IUpdatePasswordDTO';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

@injectable()
export default class UpdateUserPasswordService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    id,
    password,
    new_password,
    confirm_password,
  }: IUpdatePasswordDTO): Promise<User> {
    const checkExistentUser = await this.usersRepository.findById(id);

    if (!checkExistentUser)
      throw new AppError('This user does not exists!', 400);

    const user = checkExistentUser;

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) throw new AppError('Incorrect password!', 401);

    if (new_password !== confirm_password)
      throw new AppError(
        'New password and password confirmation does not matches!',
        400,
      );

    user.password = new_password;

    await this.usersRepository.save(user);

    return user;
  }
}
