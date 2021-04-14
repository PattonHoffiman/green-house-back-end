"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IUsersRepository = _interopRequireDefault(require("../../users/repositories/IUsersRepository"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IPlantsRepository = _interopRequireDefault(require("../repositories/IPlantsRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreatePlantService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('PlantsRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default, typeof _IPlantsRepository.default === "undefined" ? Object : _IPlantsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class CreatePlantService {
  constructor(cacheProvider, usersRepository, plantsRepository) {
    this.cacheProvider = cacheProvider;
    this.usersRepository = usersRepository;
    this.plantsRepository = plantsRepository;
  }

  async execute({
    name,
    user_id,
    days_to_water
  }) {
    const cacheKey = `user-plants:${user_id}`;
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new _AppError.default('This user does not exists!', 400);
    const today = new Date();
    const water_day = (0, _dateFns.addDays)(today, days_to_water);
    const plant = await this.plantsRepository.create(user_id, name, days_to_water, water_day);
    const plants = await this.cacheProvider.recover(cacheKey);

    if (plants) {
      plants.push(plant);
      await this.cacheProvider.invalidate(cacheKey);
      await this.cacheProvider.save(cacheKey, (0, _classTransformer.classToClass)(plants));
    }
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
exports.default = CreatePlantService;