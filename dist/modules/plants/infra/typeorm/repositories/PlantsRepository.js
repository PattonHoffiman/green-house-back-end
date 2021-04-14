"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _Plant = _interopRequireDefault(require("../entities/Plant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlantsRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_Plant.default);
  }

  async save(plant) {
    await this.ormRepository.save(plant);
  }

  async delete(id) {
    await this.ormRepository.delete(id);
  }

  async saveAll(plants) {
    await this.ormRepository.save(plants);
  }

  async findById(id) {
    const plant = await this.ormRepository.findOne(id);
    return plant;
  }

  async findAll(user_id) {
    const plants = await this.ormRepository.find({
      where: {
        user_id
      }
    });
    return plants.length === 0 ? undefined : plants;
  }

  async findByDate(user_id, date) {
    const plants = await this.ormRepository.find({
      where: {
        user_id,
        water_day: date
      }
    });
    return plants.length === 0 ? undefined : plants;
  }

  async create(user_id, name, days_to_water, water_day) {
    const newPlant = this.ormRepository.create({
      user_id,
      name,
      days_to_water,
      water_day
    });
    await this.ormRepository.save(newPlant);
    return newPlant;
  }

}

exports.default = PlantsRepository;