"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IStorageProvider = _interopRequireDefault(require("../../../shared/container/providers/StorageProvider/models/IStorageProvider"));

var _IPlantsRepository = _interopRequireDefault(require("../repositories/IPlantsRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdatePlantAvatarService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('StorageProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('PlantsRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IStorageProvider.default === "undefined" ? Object : _IStorageProvider.default, typeof _IPlantsRepository.default === "undefined" ? Object : _IPlantsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class UpdatePlantAvatarService {
  constructor(cacheProvider, storageProvider, plantsRepository) {
    this.cacheProvider = cacheProvider;
    this.storageProvider = storageProvider;
    this.plantsRepository = plantsRepository;
  }

  async execute({
    user_id,
    plant_id,
    avatar_filename
  }) {
    const cacheKey = `user-plants:${user_id}`;
    const plant = await this.plantsRepository.findById(plant_id);
    if (!plant) throw new _AppError.default('This plant does not exists!', 400);

    if (plant.avatar_url) {
      await this.storageProvider.deleteFile(plant.avatar_url);
    }

    const filename = await this.storageProvider.saveFile(avatar_filename);
    plant.avatar_url = filename;
    await this.plantsRepository.save(plant);
    const plants = await this.cacheProvider.recover(cacheKey);

    if (plants) {
      const updatedPlants = plants.map(plantArray => {
        if (plantArray.id === plant.id) {
          const address = plant.getAvatar_url();
          if (address) plantArray.avatar_url = address;
        }

        return plantArray;
      });
      await this.cacheProvider.invalidate(cacheKey);
      await this.cacheProvider.save(cacheKey, (0, _classTransformer.classToClass)(updatedPlants));
    }

    return plant;
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
exports.default = UpdatePlantAvatarService;