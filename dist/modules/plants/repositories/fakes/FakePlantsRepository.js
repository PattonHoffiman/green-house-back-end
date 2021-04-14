"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuid = require("uuid");

var _Plant = _interopRequireDefault(require("../../infra/typeorm/entities/Plant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FakePlantsRepository {
  constructor() {
    this.plants = [];
  }

  async save(plant) {
    this.plants = this.plants.map(arrayPlant => {
      if (arrayPlant.id === plant.id) return plant;
      return arrayPlant;
    });
  }

  async delete(id) {
    const updatedPlants = this.plants.filter(plant => plant.id !== id);
    this.plants = updatedPlants;
  }

  async saveAll(plants) {
    this.plants = plants;
  }

  async findById(id) {
    const plant = this.plants.find(plant => plant.id === id);
    return plant;
  }

  async findAll(user_id) {
    const user_plants = this.plants.filter(plant => plant.user_id === user_id);
    return user_plants.length === 0 ? undefined : user_plants;
  }

  async findByDate(user_id, date) {
    const water_plants = this.plants.filter(plant => plant.user_id === user_id && plant.water_day === date);
    return water_plants.length === 0 ? undefined : water_plants;
  }

  async create(user_id, name, days_to_water, water_day) {
    const plant = new _Plant.default();
    Object.assign(plant, {
      name,
      user_id,
      water_day,
      id: (0, _uuid.v4)(),
      days_to_water,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date()
    });
    this.plants.push(plant);
    return plant;
  }

}

exports.default = FakePlantsRepository;