"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _CreateUserService = _interopRequireDefault(require("../CreateUserService"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let createUser;
let fakeHashProvider;
let fakeUsersRepository;
describe('Create User', () => {
  beforeEach(() => {
    fakeHashProvider = new _FakeHashProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    createUser = new _CreateUserService.default(fakeHashProvider, fakeUsersRepository);
  });
  it('should be able to create a new user', async () => {
    await createUser.execute({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'a-password'
    });
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');
    expect(user).not.toBeUndefined();

    if (user) {
      expect(user).toHaveProperty('id');
      expect(user.name).toEqual('Patton Hoffiman');
      expect(user.email).toEqual('PattonHoffiman@gmail.com');
      expect(fakeHashProvider.compareHash('a-password', user.password)).toBeTruthy();
    }
  });
  it('should not be able to create an user with existent e-mail', async () => {
    await createUser.execute({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'a-password'
    });
    await expect(createUser.execute({
      name: 'Patton Hoffiman',
      email: 'PattonHoffiman@gmail.com',
      password: 'a-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});