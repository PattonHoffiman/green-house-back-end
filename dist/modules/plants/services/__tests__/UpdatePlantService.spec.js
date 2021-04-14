"use strict";

require("reflect-metadata");

var _dateFns = require("date-fns");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _UpdatePlantService = _interopRequireDefault(require("../UpdatePlantService"));

var _FakePlantsRepository = _interopRequireDefault(require("../../repositories/fakes/FakePlantsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let updatePlant;
let fakeCacheProvider;
let fakePlantsRepository;
describe('Update Plant Service', () => {
  beforeEach(() => {
    fakePlantsRepository = new _FakePlantsRepository.default();
    updatePlant = new _UpdatePlantService.default(fakeCacheProvider, fakePlantsRepository);
  });
  it('should be able to update a plant', async () => {
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Freddy', 2, (0, _dateFns.addDays)(today, 2));
    const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Freddy');

    if (plant) {
      const updatedPlant = await updatePlant.execute({
        id: plant.id,
        name: 'Fredy',
        days_to_water: 2,
        user_id: 'user-id'
      });
      expect(updatedPlant.name).toEqual('Fredy');
    }

    expect(plant).not.toBeUndefined();
  });
  it("should not be able to update if the plant doesn't exists", async () => {
    await expect(updatePlant.execute({
      id: 'fake-id',
      name: 'Fredy',
      days_to_water: 2,
      user_id: 'fake-user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to change the water day if the days to water change so', async () => {
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Freddy', 2, (0, _dateFns.addDays)(today, 2));
    const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Freddy');

    if (plant) {
      const updatedPlant = await updatePlant.execute({
        id: plant.id,
        name: 'Fredy',
        days_to_water: 3,
        user_id: 'user_id'
      });
      const formattedWaterDay = (0, _dateFns.format)((0, _dateFns.addDays)(today, 3), 'dd/MM/yyyy');
      expect(updatedPlant.name).toEqual('Fredy');
      expect(updatedPlant.days_to_water).toEqual(3);
      expect((0, _dateFns.format)(updatedPlant.water_day, 'dd/MM/yyyy')).toEqual(formattedWaterDay);
    }

    expect(plant).not.toBeUndefined();
  });
});