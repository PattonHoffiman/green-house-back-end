import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../../repositories/fakes/FakeUserTokensRepository';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import SendConfirmEmailService from '../SendConfirmEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendConfirmEmail: SendConfirmEmailService;

describe('Send Confirm Email', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendConfirmEmail = new SendConfirmEmailService(
      fakeMailProvider,
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to send an e-mail to confirm the email', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    await sendConfirmEmail.execute('PattonHoffiman@gmail.com');

    expect(fakeMailProvider.messages).toHaveLength(1);
  });

  it('should be able to generate an token to validate the user', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      await sendConfirmEmail.execute('PattonHoffiman@gmail.com');
      expect(generate).toHaveBeenCalledWith(user.id, 'confirm');
    }

    expect(user).not.toBeUndefined();
  });

  it('should not be able to send an e-mail if him does not exists', async () => {
    await expect(
      sendConfirmEmail.execute('non-existent-email'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
