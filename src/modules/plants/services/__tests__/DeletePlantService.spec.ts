import 'reflect-metadata';

import { addDays } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import DeletePlantService from '../DeletePlantService';
import UpdatePlantAvatarService from '../UpdatePlantAvatarService';

import FakePlantsRepository from '../../repositories/fakes/FakePlantsRepository';

let deletePlant: DeletePlantService;
let updatePlantAvatar: UpdatePlantAvatarService;

let fakeCacheProvider: FakeCacheProvider;
let fakeStorageProvider: FakeStorageProvider;
let fakePlantsRepository: FakePlantsRepository;

describe('Delete Plant Service', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakePlantsRepository = new FakePlantsRepository();

    deletePlant = new DeletePlantService(
      fakeCacheProvider,
      fakeStorageProvider,
      fakePlantsRepository,
    );

    updatePlantAvatar = new UpdatePlantAvatarService(
      fakeCacheProvider,
      fakeStorageProvider,
      fakePlantsRepository,
    );
  });

  it('should be delete a plant', async () => {
    const today = new Date();
    await fakePlantsRepository.create(
      'user-id',
      'Freddy',
      2,
      addDays(today, 2),
    );

    const plant = fakePlantsRepository.plants.find(
      plantArray => plantArray.name === 'Freddy',
    );

    if (plant) {
      await deletePlant.execute(plant.id, 'user-id');
      const deletedPlant = await fakePlantsRepository.findById(plant.id);

      expect(deletedPlant).toBeUndefined();
    }

    expect(plant).not.toBeUndefined();
  });

  it("should not be able to delete if the plant doesn't exists", async () => {
    await expect(
      deletePlant.execute('fake-id', 'fake-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete the avatar file when deleting plant', async () => {
    const today = new Date();
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await fakePlantsRepository.create('user-id', 'Fredy', 2, addDays(today, 2));

    const plant = fakePlantsRepository.plants.find(
      plantArray => plantArray.name === 'Fredy',
    );

    if (plant) {
      await updatePlantAvatar.execute({
        user_id: 'user_id',
        plant_id: plant.id,
        avatar_filename: 'avatar.jpg',
      });

      await deletePlant.execute(plant.id, 'user-id');
      const deletedPlant = await fakePlantsRepository.findById(plant.id);

      expect(deletedPlant).toBeUndefined();
      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    }

    expect(plant).not.toBeUndefined();
  });
});
