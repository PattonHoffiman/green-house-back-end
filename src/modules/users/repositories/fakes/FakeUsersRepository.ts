import { v4 as uuid } from 'uuid';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../IUsersRepository';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async save(user: User): Promise<void> {
    this.users = this.users.map(arrayUser => {
      if (arrayUser.id === user.id) return user;
      return arrayUser;
    });
  }

  public async delete(id: string): Promise<void> {
    const updatedUsers = this.users.filter(user => user.id !== id);
    this.users = updatedUsers;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    return user;
  }

  public async create(
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      is_confirmed: false,
    });

    this.users.push(user);
  }
}
