import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import AuthenticateUserService from '../AuthenticateUserService';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUser: AuthenticateUserService;

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    authenticateUser = new AuthenticateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to create a session', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      user.is_confirmed = true;
      await fakeUsersRepository.save(user);

      const session = await authenticateUser.execute({
        email: 'PattonHoffiman@gmail.com',
        password: 'a-password',
      });

      expect(session.user.id).toEqual(user.id);
      expect(session).toHaveProperty('token');
    }

    expect(user).not.toBeUndefined();
  });

  it('should not be able to create a session with wrong password', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    await expect(
      authenticateUser.execute({
        email: 'PattonHoffiman@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a session with non existent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'PattonHoffiman@gmail.com',
        password: 'a-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a session if user does not confirm the email', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      await expect(
        authenticateUser.execute({
          email: 'PattonHoffiman@gmail.com',
          password: 'a-password',
        }),
      ).rejects.toBeInstanceOf(AppError);
    }

    expect(user).not.toBeUndefined();
  });
});
