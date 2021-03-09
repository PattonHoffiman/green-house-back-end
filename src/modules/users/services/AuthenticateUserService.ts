import { sign } from 'jsonwebtoken';

import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth.config';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IAuthenticateUserDTO from '../dtos/IAuthenticateUserDTO';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    email,
    password,
  }: IAuthenticateUserDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Incorrect email/password combination', 401);

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched)
      throw new AppError('Incorrect email/password combination', 401);

    if (!user.is_confirmed)
      throw new AppError('Confirm your e-mail address', 401);

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
