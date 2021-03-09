import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import UpdateUserPasswordService from '../UpdateUserPasswordService';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateUserPassword: UpdateUserPasswordService;

describe('Update User Password', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateUserPassword = new UpdateUserPasswordService(
      fakeHashProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to change the password', async () => {
    fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      const updatedUser = await updateUserPassword.execute({
        id: user.id,
        password: 'a-password',
        new_password: 'another-password',
        confirm_password: 'another-password',
      });

      expect(updatedUser.password).not.toEqual('a-password');
      expect(updatedUser.password).toEqual('another-password');
    }

    expect(user).not.toBeUndefined();
  });

  it("should not be able to change the password if user doesn't exist", async () => {
    await expect(
      updateUserPassword.execute({
        id: 'fake-id',
        password: 'fake-pass',
        new_password: 'fake-new-pass',
        confirm_password: 'fake-confirmation',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to change the password if the user's password was wrong", async () => {
    fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      await expect(
        updateUserPassword.execute({
          id: user.id,
          password: 'wrong-password',
          new_password: 'another-password',
          confirm_password: 'another-password',
        }),
      ).rejects.toBeInstanceOf(AppError);
    }

    expect(user).not.toBeUndefined();
  });

  it('should not be able to change the password if the new password and confirm password was diff', async () => {
    fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      await expect(
        updateUserPassword.execute({
          id: user.id,
          password: 'a-password',
          new_password: 'another-password',
          confirm_password: 'diff-password',
        }),
      ).rejects.toBeInstanceOf(AppError);
    }

    expect(user).not.toBeUndefined();
  });
});
