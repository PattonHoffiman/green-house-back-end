import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

export default class UserTokenRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async remove(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async generate(
    user_id: string,
    type: 'confirm' | 'retrieve',
  ): Promise<UserToken> {
    const userToken = this.ormRepository.create({ user_id, type });
    await this.ormRepository.save(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = await this.ormRepository.findOne({
      where: { token },
    });

    return findUserToken;
  }
}
