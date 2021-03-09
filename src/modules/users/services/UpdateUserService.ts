import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, name, email }: IUpdateUserDTO): Promise<User> {
    const checkExistentUser = await this.usersRepository.findById(id);

    if (!checkExistentUser)
      throw new AppError('This user does not exists!', 400);

    const user = checkExistentUser;
    const checkExistentEmail = await this.usersRepository.findByEmail(email);

    if (checkExistentEmail && user.email !== email)
      throw new AppError('This e-mail already exists!', 409);

    user.name = name;
    user.email = email;
    user.updated_at = new Date();

    await this.usersRepository.save(user);

    return user;
  }
}
