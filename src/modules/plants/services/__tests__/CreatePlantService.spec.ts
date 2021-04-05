import 'reflect-metadata';

import { addDays, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreatePlantService from '../CreatePlantService';
import FakePlantsRepository from '../../repositories/fakes/FakePlantsRepository';

let createPlant: CreatePlantService;
let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakePlantsRepository: FakePlantsRepository;

describe('Create Plant Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePlantsRepository = new FakePlantsRepository();
    createPlant = new CreatePlantService(
      fakeCacheProvider,
      fakeUsersRepository,
      fakePlantsRepository,
    );
  });

  it('should be able to create a new plant', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      await createPlant.execute({
        name: 'Freddy',
        user_id: user.id,
        days_to_water: 2,
      });

      const plant = fakePlantsRepository.plants.find(
        plantArray => plantArray.name === 'Freddy',
      );

      const today = new Date();
      const formattedWaterDay = format(addDays(today, 2), 'dd/MM/yyyy');

      if (plant) {
        expect(plant).toHaveProperty('id');
        expect(plant.name).toEqual('Freddy');
        expect(plant.user_id).toEqual(user.id);
        expect(plant.days_to_water).toEqual(2);
        expect(format(plant.water_day, 'dd/MM/yyyy')).toEqual(
          formattedWaterDay,
        );
      }

      expect(plant).not.toBeUndefined();
    }

    expect(user).not.toBeUndefined();
  });

  it("should not be able to create a new plant if users doesn't exists", async () => {
    await expect(
      createPlant.execute({
        name: 'Freddy',
        days_to_water: 2,
        user_id: 'fake_user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
