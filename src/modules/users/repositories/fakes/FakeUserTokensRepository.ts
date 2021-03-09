import { v4 as uuid } from 'uuid';

import IUserTokensRepository from '../IUserTokensRepository';
import UserToken from '../../infra/typeorm/entities/UserToken';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async remove(id: string): Promise<void> {
    this.userTokens = this.userTokens.filter(userToken => userToken.id !== id);
  }

  public async generate(
    user_id: string,
    type: 'confirm' | 'retrieve',
  ): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      type,
      user_id,
      id: uuid(),
      token: 'fake-token',
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );
    return userToken;
  }
}
