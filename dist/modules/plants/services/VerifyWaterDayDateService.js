"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IPlantsRepository = _interopRequireDefault(require("../repositories/IPlantsRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let VerifyWaterDayDateService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('PlantsRepository')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IPlantsRepository.default === "undefined" ? Object : _IPlantsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class VerifyWaterDayDateService {
  constructor(cacheProvider, plantsRepository) {
    this.cacheProvider = cacheProvider;
    this.plantsRepository = plantsRepository;
  }

  async execute(user_id) {
    const today = new Date();
    const cacheKey = `user-plants:${user_id}`;
    const plants = await this.plantsRepository.findAll(user_id);

    if (plants) {
      const updatedPlants = plants.map(plant => {
        const water_day = new Date(plant.water_day);

        if (water_day.getFullYear() === today.getFullYear() && water_day.getMonth() + 1 === today.getMonth() + 1) {
          if (water_day.getUTCDate() < today.getUTCDate()) {
            if (plant.days_to_water === 1) plant.water_day = today;else plant.water_day = (0, _dateFns.addDays)(today, plant.days_to_water);
          }
        } else if (water_day.getFullYear() < today.getFullYear() || water_day.getMonth() + 1 < today.getMonth() + 1) {
          if (plant.days_to_water === 1) plant.water_day = today;else plant.water_day = (0, _dateFns.addDays)(today, plant.days_to_water);
        }

        return plant;
      });
      await this.cacheProvider.invalidate(cacheKey);
      await this.plantsRepository.saveAll(updatedPlants);
      await this.cacheProvider.save(cacheKey, (0, _classTransformer.classToClass)(updatedPlants));
    }
  }

}) || _class) || _class) || _class) || _class) || _class);
exports.default = VerifyWaterDayDateService;