"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _UpdateUserPasswordService = _interopRequireDefault(require("../UpdateUserPasswordService"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeHashProvider;
let fakeUsersRepository;
let updateUserPassword;
describe('Update User Password', () => {
  beforeEach(() => {
    fakeHashProvider = new _FakeHashProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    updateUserPassword = new _UpdateUserPasswordService.default(fakeHashProvider, fakeUsersRepository);
  });
  it('should be able to change the password', async () => {
    fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const updatedUser = await updateUserPassword.execute({
        id: user.id,
        password: 'a-password',
        new_password: 'another-password',
        confirm_password: 'another-password'
      });
      expect(updatedUser.password).not.toEqual('a-password');
      expect(updatedUser.password).toEqual('another-password');
    }

    expect(user).not.toBeUndefined();
  });
  it("should not be able to change the password if user doesn't exist", async () => {
    await expect(updateUserPassword.execute({
      id: 'fake-id',
      password: 'fake-pass',
      new_password: 'fake-new-pass',
      confirm_password: 'fake-confirmation'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it("should not be able to change the password if the user's password was wrong", async () => {
    fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await expect(updateUserPassword.execute({
        id: user.id,
        password: 'wrong-password',
        new_password: 'another-password',
        confirm_password: 'another-password'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to change the password if the new password and confirm password was diff', async () => {
    fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await expect(updateUserPassword.execute({
        id: user.id,
        password: 'a-password',
        new_password: 'another-password',
        confirm_password: 'diff-password'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
});