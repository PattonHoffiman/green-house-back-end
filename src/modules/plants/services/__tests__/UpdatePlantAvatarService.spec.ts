import 'reflect-metadata';
import { addDays } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePlantsRepository from '../../repositories/fakes/FakePlantsRepository';

import UpdatePlantAvatarService from '../UpdatePlantAvatarService';

let fakeCacheProvider: FakeCacheProvider;
let fakeStorageProvider: FakeStorageProvider;
let fakePlantsRepository: FakePlantsRepository;
let updatePlantAvatar: UpdatePlantAvatarService;

describe('Update Plant Avatar Service', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakePlantsRepository = new FakePlantsRepository();
    updatePlantAvatar = new UpdatePlantAvatarService(
      fakeCacheProvider,
      fakeStorageProvider,
      fakePlantsRepository,
    );
  });

  it('should be able to update plant avatar', async () => {
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Fredy', 2, addDays(today, 2));

    const plant = fakePlantsRepository.plants.find(
      plantArray => plantArray.name === 'Fredy',
    );

    if (plant) {
      const updatedPlant = await updatePlantAvatar.execute({
        user_id: 'user-id',
        plant_id: plant.id,
        avatar_filename: 'avatar.jpeg',
      });

      expect(updatedPlant.avatar_url === 'avatar.jpeg');
    }

    expect(plant).not.toBeUndefined();
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Fredy', 2, addDays(today, 2));

    const plant = fakePlantsRepository.plants.find(
      plantArray => plantArray.name === 'Fredy',
    );

    if (plant) {
      await updatePlantAvatar.execute({
        user_id: 'user-id',
        plant_id: plant.id,
        avatar_filename: 'avatar.jpeg',
      });

      await updatePlantAvatar.execute({
        user_id: 'user-id',
        plant_id: plant.id,
        avatar_filename: 'avatar2.jpeg',
      });

      expect(deleteFile).toHaveBeenCalledWith('avatar.jpeg');
      expect(plant.avatar_url).toBe('avatar2.jpeg');
    }

    expect(plant).not.toBeUndefined();
  });

  it('should not be able to update avatar from non existent user', async () => {
    await expect(
      updatePlantAvatar.execute({
        plant_id: 'non-existent-id',
        avatar_filename: 'avatar.jpg',
        user_id: 'non-existent-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
