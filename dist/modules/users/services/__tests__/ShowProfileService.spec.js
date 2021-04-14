"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _ShowProfileService = _interopRequireDefault(require("../ShowProfileService"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let showProfile;
let fakeUsersRepository;
describe('Show Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    showProfile = new _ShowProfileService.default(fakeUsersRepository);
  });
  it('should be show the profile', async () => {
    fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const profile = await showProfile.execute(user.id);
      expect(profile.id).toEqual(user.id);
    }

    expect(user).not.toBeUndefined();
  });
  it('should be not show profile if id does not exists', async () => {
    await expect(showProfile.execute('fake-id')).rejects.toBeInstanceOf(_AppError.default);
  });
});