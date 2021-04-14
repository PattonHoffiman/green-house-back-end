"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeStorageProvider = _interopRequireDefault(require("../../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _DeleteUserService = _interopRequireDefault(require("../DeleteUserService"));

var _UpdateUserAvatarService = _interopRequireDefault(require("../UpdateUserAvatarService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeStorageProvider;
let deleteUser;
let updateUserAvatar;
describe('Delete User', () => {
  beforeEach(() => {
    fakeStorageProvider = new _FakeStorageProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    deleteUser = new _DeleteUserService.default(fakeStorageProvider, fakeUsersRepository);
    updateUserAvatar = new _UpdateUserAvatarService.default(fakeStorageProvider, fakeUsersRepository);
  });
  it('should be able to delete an user', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await deleteUser.execute(user.id);
      const deletedUser = await fakeUsersRepository.findById(user.id);
      expect(deletedUser).toBeUndefined();
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to delete a non existent user', async () => {
    await expect(deleteUser.execute('non-existent-id')).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to delete the avatar file when deleting the user', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await updateUserAvatar.execute({
        user_id: user.id,
        avatar_filename: 'avatar.jpg'
      });
      await deleteUser.execute(user.id);
      const deletedUser = await fakeUsersRepository.findById(user.id);
      expect(deletedUser).toBeUndefined();
      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    }

    expect(user).not.toBeUndefined();
  });
});