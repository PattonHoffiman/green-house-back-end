"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeStorageProvider = _interopRequireDefault(require("../../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _UpdateUserAvatarService = _interopRequireDefault(require("../UpdateUserAvatarService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeStorageProvider;
let updateUserAvatar;
describe('Update User Avatar', () => {
  beforeEach(() => {
    fakeStorageProvider = new _FakeStorageProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    updateUserAvatar = new _UpdateUserAvatarService.default(fakeStorageProvider, fakeUsersRepository);
  });
  it('should be able to update user avatar', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const updatedUser = await updateUserAvatar.execute({
        user_id: user.id,
        avatar_filename: 'avatar.jpg'
      });
      expect(updatedUser.avatar_url).toBe('avatar.jpg');
    }

    expect(user).not.toBeUndefined();
  });
  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await updateUserAvatar.execute({
        user_id: user.id,
        avatar_filename: 'avatar.jpg'
      });
      await updateUserAvatar.execute({
        user_id: user.id,
        avatar_filename: 'avatar2.jpg'
      });
      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
      expect(user.avatar_url).toBe('avatar2.jpg');
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to update avatar from non existent user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'non-existent-id',
      avatar_filename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});