import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateUserService from '../CreateUserService';

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    createUser = new CreateUserService(fakeHashProvider, fakeUsersRepository);
  });

  it('should be able to create a new user', async () => {
    await createUser.execute({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'a-password',
    });

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    expect(user).not.toBeUndefined();

    if (user) {
      expect(user).toHaveProperty('id');
      expect(user.name).toEqual('Patton Hoffiman');
      expect(user.email).toEqual('PattonHoffiman@gmail.com');
      expect(
        fakeHashProvider.compareHash('a-password', user.password),
      ).toBeTruthy();
    }
  });

  it('should not be able to create an user with existent e-mail', async () => {
    await createUser.execute({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'a-password',
    });

    await expect(
      createUser.execute({
        name: 'Patton Hoffiman',
        email: 'PattonHoffiman@gmail.com',
        password: 'a-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
