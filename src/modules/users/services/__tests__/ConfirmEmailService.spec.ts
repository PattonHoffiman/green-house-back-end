import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../../repositories/fakes/FakeUserTokensRepository';

import ConfirmEmailService from '../ConfirmEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;

let confirmEmail: ConfirmEmailService;

describe('ConfirmEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    confirmEmail = new ConfirmEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to confirm email', async () => {
    const remove = jest.spyOn(fakeUserTokensRepository, 'remove');

    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      const { token, id } = await fakeUserTokensRepository.generate(
        user.id,
        'confirm',
      );

      await confirmEmail.execute(token);

      const updatedUser = await fakeUsersRepository.findById(user.id);

      expect(updatedUser?.is_confirmed).toBeTruthy();
      expect(remove).toHaveBeenCalledWith(id);
    }

    expect(user).not.toBeUndefined();
  });

  it('should not be able to confirm the email with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
      'confirm',
    );

    await expect(confirmEmail.execute(token)).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to confirm the email with non-existing token', async () => {
    await expect(
      confirmEmail.execute('non-existing-token'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to confirm the email if past more then two hours', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      const { token } = await fakeUserTokensRepository.generate(
        user.id,
        'confirm',
      );

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        const customDate = new Date();
        return customDate.setHours(customDate.getHours() + 3);
      });

      await expect(confirmEmail.execute(token)).rejects.toBeInstanceOf(
        AppError,
      );
    }

    expect(user).not.toBeUndefined();
  });

  it('should not be able to reset the password if the type of token was wrong', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      const { token } = await fakeUserTokensRepository.generate(
        user.id,
        'retrieve',
      );

      await expect(confirmEmail.execute(token)).rejects.toBeInstanceOf(
        AppError,
      );
    }

    expect(user).not.toBeUndefined();
  });
});
