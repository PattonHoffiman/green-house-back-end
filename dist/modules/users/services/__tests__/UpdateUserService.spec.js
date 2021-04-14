"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _UpdateUserService = _interopRequireDefault(require("../UpdateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let updateUser;
let fakeUsersRepository;
describe('Update User', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    updateUser = new _UpdateUserService.default(fakeUsersRepository);
  });
  it('should be able to update an user', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    let user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const updatedUser = await updateUser.execute({
        id: user.id,
        name: 'Patton Hoffiman Melges Faria',
        email: 'PattonHoffiman@outlook.com'
      });
      user = await fakeUsersRepository.findById(user.id);

      if (user) {
        expect(user.name).toEqual(updatedUser.name);
        expect(user.email).toEqual(updatedUser.email);
      }
    }

    expect(user).not.toBeUndefined();
  });
  it('should be able to update only the name of user', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    let user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const updatedUser = await updateUser.execute({
        id: user.id,
        name: 'Patton Hoffiman Melges Faria',
        email: 'PattonHoffiman@gmail.com'
      });
      user = await fakeUsersRepository.findById(user.id);

      if (user) {
        expect(user.name).toEqual(updatedUser.name);
      }
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to update an non existent user', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await expect(updateUser.execute({
        id: 'fake-id',
        name: 'Patton Hoffiman Melges Faria',
        email: 'PattonHoffiman@outlook.com'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to update an user with an existent e-mail', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@outlook.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await expect(updateUser.execute({
        id: user.id,
        name: 'Patton Hoffiman Melges Faria',
        email: 'PattonHoffiman@outlook.com'
      })).rejects.toBeInstanceOf(_AppError.default);
    }

    expect(user).not.toBeUndefined();
  });
});