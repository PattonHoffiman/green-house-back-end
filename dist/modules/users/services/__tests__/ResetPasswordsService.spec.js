"use strict";

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUserTokensRepository"));

var _ResetPasswordsService = _interopRequireDefault(require("../ResetPasswordsService"));

var _FakeHashProvider = _interopRequireDefault(require("../../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeHashProvider;
let fakeUsersRepository;
let fakeUserTokensRepository;
let resetPassword;
describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeHashProvider = new _FakeHashProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeUserTokensRepository = new _FakeUserTokensRepository.default();
    resetPassword = new _ResetPasswordsService.default(fakeHashProvider, fakeUsersRepository, fakeUserTokensRepository);
  });
  it('should be able to reset the password', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const {
        token,
        id
      } = await fakeUserTokensRepository.generate(user.id, 'retrieve');
      const remove = jest.spyOn(fakeUserTokensRepository, 'remove');
      const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
      await resetPassword.execute({
        token,
        password: 'another-password',
        password_confirmation: 'another-password'
      });
      const updatedUser = await fakeUsersRepository.findById(user.id);
      expect(generateHash).toHaveBeenCalledWith('another-password');
      expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('another-password');
      expect(remove).toHaveBeenCalledWith(id);
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to reset the password with non-existing user', async () => {
    const {
      token
    } = await fakeUserTokensRepository.generate('non-existing-user', 'retrieve');
    await expect(resetPassword.execute({
      token,
      password: 'a-password',
      password_confirmation: 'a-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset the password with non-existing token', async () => {
    await expect(resetPassword.execute({
      token: 'non-existing-token',
      password: 'a-password',
      password_confirmation: 'a-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset the password if past more then two hours', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const {
        token
      } = await fakeUserTokensRepository.generate(user.id, 'retrieve');
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        const customDate = new Date();
        return customDate.setHours(customDate.getHours() + 3);
      });
      await expect(resetPassword.execute({
        token,
        password: 'Rockcastle100#@!',
        password_confirmation: 'Rockcastle100#@!'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to reset the password if the type of token was wrong', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const {
        token
      } = await fakeUserTokensRepository.generate(user.id, 'confirm');
      await expect(resetPassword.execute({
        token,
        password: 'another-password',
        password_confirmation: 'another-password'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to reset the password if password and password_confirmation does not matches', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const {
        token
      } = await fakeUserTokensRepository.generate(user.id, 'retrieve');
      await expect(resetPassword.execute({
        token,
        password: 'another-password',
        password_confirmation: 'diff-password'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
});