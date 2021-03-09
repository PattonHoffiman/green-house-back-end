import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import DeleteUserService from '../DeleteUserService';
import UpdateUserAvatarService from '../UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

let deleteUser: DeleteUserService;
let updateUserAvatar: UpdateUserAvatarService;

describe('Delete User', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();

    deleteUser = new DeleteUserService(
      fakeStorageProvider,
      fakeUsersRepository,
    );

    updateUserAvatar = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to delete an user', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      await deleteUser.execute(user.id);
      const deletedUser = await fakeUsersRepository.findById(user.id);
      expect(deletedUser).toBeUndefined();
    }

    expect(user).not.toBeUndefined();
  });

  it('should not be able to delete a non existent user', async () => {
    await expect(deleteUser.execute('non-existent-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should be able to delete the avatar file when deleting the user', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      await updateUserAvatar.execute({
        user_id: user.id,
        avatar_filename: 'avatar.jpg',
      });

      await deleteUser.execute(user.id);
      const deletedUser = await fakeUsersRepository.findById(user.id);

      expect(deletedUser).toBeUndefined();
      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    }

    expect(user).not.toBeUndefined();
  });
});
