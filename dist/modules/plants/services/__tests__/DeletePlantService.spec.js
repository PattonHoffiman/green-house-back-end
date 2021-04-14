"use strict";

require("reflect-metadata");

var _dateFns = require("date-fns");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeStorageProvider = _interopRequireDefault(require("../../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _DeletePlantService = _interopRequireDefault(require("../DeletePlantService"));

var _UpdatePlantAvatarService = _interopRequireDefault(require("../UpdatePlantAvatarService"));

var _FakePlantsRepository = _interopRequireDefault(require("../../repositories/fakes/FakePlantsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let deletePlant;
let updatePlantAvatar;
let fakeCacheProvider;
let fakeStorageProvider;
let fakePlantsRepository;
describe('Delete Plant Service', () => {
  beforeEach(() => {
    fakeStorageProvider = new _FakeStorageProvider.default();
    fakePlantsRepository = new _FakePlantsRepository.default();
    deletePlant = new _DeletePlantService.default(fakeCacheProvider, fakeStorageProvider, fakePlantsRepository);
    updatePlantAvatar = new _UpdatePlantAvatarService.default(fakeCacheProvider, fakeStorageProvider, fakePlantsRepository);
  });
  it('should be delete a plant', async () => {
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Freddy', 2, (0, _dateFns.addDays)(today, 2));
    const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Freddy');

    if (plant) {
      await deletePlant.execute(plant.id, 'user-id');
      const deletedPlant = await fakePlantsRepository.findById(plant.id);
      expect(deletedPlant).toBeUndefined();
    }

    expect(plant).not.toBeUndefined();
  });
  it("should not be able to delete if the plant doesn't exists", async () => {
    await expect(deletePlant.execute('fake-id', 'fake-user-id')).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to delete the avatar file when deleting plant', async () => {
    const today = new Date();
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    await fakePlantsRepository.create('user-id', 'Fredy', 2, (0, _dateFns.addDays)(today, 2));
    const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Fredy');

    if (plant) {
      await updatePlantAvatar.execute({
        user_id: 'user_id',
        plant_id: plant.id,
        avatar_filename: 'avatar.jpg'
      });
      await deletePlant.execute(plant.id, 'user-id');
      const deletedPlant = await fakePlantsRepository.findById(plant.id);
      expect(deletedPlant).toBeUndefined();
      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    }

    expect(plant).not.toBeUndefined();
  });
});