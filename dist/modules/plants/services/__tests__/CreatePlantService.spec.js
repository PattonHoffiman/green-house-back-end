"use strict";

require("reflect-metadata");

var _dateFns = require("date-fns");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../../../users/repositories/fakes/FakeUsersRepository"));

var _CreatePlantService = _interopRequireDefault(require("../CreatePlantService"));

var _FakePlantsRepository = _interopRequireDefault(require("../../repositories/fakes/FakePlantsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let createPlant;
let fakeCacheProvider;
let fakeUsersRepository;
let fakePlantsRepository;
describe('Create Plant Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakePlantsRepository = new _FakePlantsRepository.default();
    createPlant = new _CreatePlantService.default(fakeCacheProvider, fakeUsersRepository, fakePlantsRepository);
  });
  it('should be able to create a new plant', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await createPlant.execute({
        name: 'Freddy',
        user_id: user.id,
        days_to_water: 2
      });
      const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Freddy');
      const today = new Date();
      const formattedWaterDay = (0, _dateFns.format)((0, _dateFns.addDays)(today, 2), 'dd/MM/yyyy');

      if (plant) {
        expect(plant).toHaveProperty('id');
        expect(plant.name).toEqual('Freddy');
        expect(plant.user_id).toEqual(user.id);
        expect(plant.days_to_water).toEqual(2);
        expect((0, _dateFns.format)(plant.water_day, 'dd/MM/yyyy')).toEqual(formattedWaterDay);
      }

      expect(plant).not.toBeUndefined();
    }

    expect(user).not.toBeUndefined();
  });
  it("should not be able to create a new plant if users doesn't exists", async () => {
    await expect(createPlant.execute({
      name: 'Freddy',
      days_to_water: 2,
      user_id: 'fake_user_id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});