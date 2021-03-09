import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  remove(id: string): Promise<void>;
  findByToken(token: string): Promise<UserToken | undefined>;
  generate(user_id: string, type: 'confirm' | 'retrieve'): Promise<UserToken>;
}
