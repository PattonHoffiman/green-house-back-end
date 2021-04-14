"use strict";

require("reflect-metadata");

var _dateFns = require("date-fns");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../../../users/repositories/fakes/FakeUsersRepository"));

var _ShowUserPlantsService = _interopRequireDefault(require("../ShowUserPlantsService"));

var _FakePlantsRepository = _interopRequireDefault(require("../../repositories/fakes/FakePlantsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCacheProvider;
let showUserPlants;
let fakeUsersRepository;
let fakePlantsRepository;
describe('Show User Plants Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakePlantsRepository = new _FakePlantsRepository.default();
    showUserPlants = new _ShowUserPlantsService.default(fakeUsersRepository, fakePlantsRepository, fakeCacheProvider);
  });
  it('should be able to list all plants for a given user', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const today = new Date();
      await fakePlantsRepository.create(user.id, 'Ann', 2, (0, _dateFns.addDays)(today, 2));
      await fakePlantsRepository.create(user.id, 'Jack', 3, (0, _dateFns.addDays)(today, 3));
      await fakePlantsRepository.create(user.id, 'Fredy', 4, (0, _dateFns.addDays)(today, 4));
      const userPlants = await showUserPlants.execute(user.id);

      if (userPlants) {
        expect(userPlants.length).toEqual(3);
      }

      expect(userPlants).not.toBeNull();
    }

    expect(user).not.toBeUndefined();
  });
  it("should not be able to list plants if the user doesn't exists", async () => {
    await expect(showUserPlants.execute('fake-id')).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be returning null if the user does not have any plants', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      const userPlants = await showUserPlants.execute(user.id);
      expect(userPlants).toBeNull();
    }

    expect(user).not.toBeUndefined();
  });
});