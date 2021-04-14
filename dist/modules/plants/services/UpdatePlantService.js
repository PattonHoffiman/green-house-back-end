"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IPlantsRepository = _interopRequireDefault(require("../repositories/IPlantsRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdatePlantService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('PlantsRepository')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IPlantsRepository.default === "undefined" ? Object : _IPlantsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class UpdatePlantService {
  constructor(cacheProvider, plantsRepository) {
    this.cacheProvider = cacheProvider;
    this.plantsRepository = plantsRepository;
  }

  async execute({
    id,
    name,
    user_id,
    days_to_water
  }) {
    const cacheKey = `user-plants:${user_id}`;
    const plant = await this.plantsRepository.findById(id);
    if (!plant) throw new _AppError.default('This plant does not exists!', 400);
    plant.name = name;
    plant.updated_at = new Date();

    if (plant.days_to_water !== days_to_water) {
      const today = new Date();
      plant.days_to_water = days_to_water;
      plant.water_day = (0, _dateFns.addDays)(today, days_to_water);
    }

    await this.plantsRepository.save(plant);
    const plants = await this.cacheProvider.recover(cacheKey);

    if (plants) {
      const updatedPlants = plants.map(plantArray => {
        if (plantArray.id === plant.id) {
          plantArray.name = plant.name;
          plantArray.water_day = plant.water_day;
          plantArray.updated_at = plant.updated_at;
          plantArray.days_to_water = plant.days_to_water;
        }

        return plantArray;
      });
      await this.cacheProvider.invalidate(cacheKey);
      await this.cacheProvider.save(cacheKey, (0, _classTransformer.classToClass)(updatedPlants));
    }

    return plant;
  }

}) || _class) || _class) || _class) || _class) || _class);
exports.default = UpdatePlantService;