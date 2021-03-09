import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(name: string, email: string, password: string): Promise<void>;
}
