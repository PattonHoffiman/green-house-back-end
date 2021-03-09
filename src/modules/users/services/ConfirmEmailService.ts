import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
export default class ConfirmEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(token: string): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) throw new AppError('User token does not exists', 400);

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User does not exist', 400);

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      await this.userTokensRepository.remove(userToken.id);
      throw new AppError('Token Expired', 401);
    }

    if (userToken.type !== 'confirm') {
      await this.userTokensRepository.remove(userToken.id);
      throw new AppError("You don't have permission to do that", 401);
    }

    user.is_confirmed = true;

    await this.usersRepository.save(user);
    await this.userTokensRepository.remove(userToken.id);
  }
}
