"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _AuthenticateUserService = _interopRequireDefault(require("../AuthenticateUserService"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeHashProvider;
let fakeUsersRepository;
let authenticateUser;
describe('Authenticate User', () => {
  beforeEach(() => {
    fakeHashProvider = new _FakeHashProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    authenticateUser = new _AuthenticateUserService.default(fakeHashProvider, fakeUsersRepository);
  });
  it('should be able to create a session', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      user.is_confirmed = true;
      await fakeUsersRepository.save(user);
      const session = await authenticateUser.execute({
        email: 'PattonHoffiman@gmail.com',
        password: 'a-password'
      });
      expect(session.user.id).toEqual(user.id);
      expect(session).toHaveProperty('token');
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to create a session with wrong password', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    await expect(authenticateUser.execute({
      email: 'PattonHoffiman@gmail.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create a session with non existent user', async () => {
    await expect(authenticateUser.execute({
      email: 'PattonHoffiman@gmail.com',
      password: 'a-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create a session if user does not confirm the email', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await expect(authenticateUser.execute({
        email: 'PattonHoffiman@gmail.com',
        password: 'a-password'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
});