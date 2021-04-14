"use strict";

require("reflect-metadata");

var _dateFns = require("date-fns");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeStorageProvider = _interopRequireDefault(require("../../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _FakePlantsRepository = _interopRequireDefault(require("../../repositories/fakes/FakePlantsRepository"));

var _UpdatePlantAvatarService = _interopRequireDefault(require("../UpdatePlantAvatarService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCacheProvider;
let fakeStorageProvider;
let fakePlantsRepository;
let updatePlantAvatar;
describe('Update Plant Avatar Service', () => {
  beforeEach(() => {
    fakeStorageProvider = new _FakeStorageProvider.default();
    fakePlantsRepository = new _FakePlantsRepository.default();
    updatePlantAvatar = new _UpdatePlantAvatarService.default(fakeCacheProvider, fakeStorageProvider, fakePlantsRepository);
  });
  it('should be able to update plant avatar', async () => {
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Fredy', 2, (0, _dateFns.addDays)(today, 2));
    const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Fredy');

    if (plant) {
      const updatedPlant = await updatePlantAvatar.execute({
        user_id: 'user-id',
        plant_id: plant.id,
        avatar_filename: 'avatar.jpeg'
      });
      expect(updatedPlant.avatar_url === 'avatar.jpeg');
    }

    expect(plant).not.toBeUndefined();
  });
  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Fredy', 2, (0, _dateFns.addDays)(today, 2));
    const plant = fakePlantsRepository.plants.find(plantArray => plantArray.name === 'Fredy');

    if (plant) {
      await updatePlantAvatar.execute({
        user_id: 'user-id',
        plant_id: plant.id,
        avatar_filename: 'avatar.jpeg'
      });
      await updatePlantAvatar.execute({
        user_id: 'user-id',
        plant_id: plant.id,
        avatar_filename: 'avatar2.jpeg'
      });
      expect(deleteFile).toHaveBeenCalledWith('avatar.jpeg');
      expect(plant.avatar_url).toBe('avatar2.jpeg');
    }

    expect(plant).not.toBeUndefined();
  });
  it('should not be able to update avatar from non existent user', async () => {
    await expect(updatePlantAvatar.execute({
      plant_id: 'non-existent-id',
      avatar_filename: 'avatar.jpg',
      user_id: 'non-existent-user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});