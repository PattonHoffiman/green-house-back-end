"use strict";

require("reflect-metadata");

var _dateFns = require("date-fns");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _ShowPlantService = _interopRequireDefault(require("../ShowPlantService"));

var _FakePlantsRepository = _interopRequireDefault(require("../../repositories/fakes/FakePlantsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let showPlant;
let fakePlantsRepository;
describe('Show Plant Service', () => {
  beforeEach(() => {
    fakePlantsRepository = new _FakePlantsRepository.default();
    showPlant = new _ShowPlantService.default(fakePlantsRepository);
  });
  it('should be able to show a plant', async () => {
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Fredy', 3, (0, _dateFns.addDays)(today, 3));
    const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Fredy');

    if (plant) {
      const findPlant = await showPlant.execute(plant.id);
      expect(plant).toEqual(findPlant.plant);
      expect(findPlant.water_last_time).toEqual('None');
      expect(findPlant.water_next_time).toEqual((0, _dateFns.format)((0, _dateFns.addDays)(today, 3), 'dd/MM/yyyy'));
    }

    expect(plant).not.toBeUndefined();
  });
  it("should not be able to show if the plant doesn't exists", async () => {
    await expect(showPlant.execute('fake-id')).rejects.toBeInstanceOf(_AppError.default);
  });
});