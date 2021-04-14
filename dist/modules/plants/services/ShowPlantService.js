"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _verifyPlantDate = _interopRequireDefault(require("../utils/verifyPlantDate"));

var _IPlantsRepository = _interopRequireDefault(require("../repositories/IPlantsRepository"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ShowPlantService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('PlantsRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _IPlantsRepository.default === "undefined" ? Object : _IPlantsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class ShowPlantService {
  constructor(plantsRepository) {
    this.plantsRepository = plantsRepository;
  }

  async execute(id) {
    const plant = await this.plantsRepository.findById(id);
    if (!plant) throw new _AppError.default('This plants does not exists!', 400);
    const {
      water_last_time,
      water_next_time
    } = (0, _verifyPlantDate.default)(plant.created_at, plant.updated_at, plant.days_to_water);
    return {
      plant,
      water_last_time,
      water_next_time
    };
  }

}) || _class) || _class) || _class) || _class);
exports.default = ShowPlantService;