import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ShowProfileService from '../ShowProfileService';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

let showProfile: ShowProfileService;
let fakeUsersRepository: FakeUsersRepository;

describe('Show Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be show the profile', async () => {
    fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      const profile = await showProfile.execute(user.id);
      expect(profile.id).toEqual(user.id);
    }

    expect(user).not.toBeUndefined();
  });

  it('should be not show profile if id does not exists', async () => {
    await expect(showProfile.execute('fake-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
