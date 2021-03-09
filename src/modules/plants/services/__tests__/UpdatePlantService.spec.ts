import 'reflect-metadata';

import { addDays, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import UpdatePlantService from '../UpdatePlantService';
import FakePlantsRepository from '../../repositories/fakes/FakePlantsRepository';

let updatePlant: UpdatePlantService;
let fakePlantsRepository: FakePlantsRepository;

describe('Update Plant Service', () => {
  beforeEach(() => {
    fakePlantsRepository = new FakePlantsRepository();
    updatePlant = new UpdatePlantService(fakePlantsRepository);
  });

  it('should be able to update a plant', async () => {
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
      const updatedPlant = await updatePlant.execute({
        id: plant.id,
        name: 'Fredy',
        days_to_water: 2,
      });

      expect(updatedPlant.name).toEqual('Fredy');
    }

    expect(plant).not.toBeUndefined();
  });

  it("should not be able to update if the plant doesn't exists", async () => {
    await expect(
      updatePlant.execute({
        id: 'fake-id',
        name: 'Fredy',
        days_to_water: 2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change the water day if the days to water change so', async () => {
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
      const updatedPlant = await updatePlant.execute({
        id: plant.id,
        name: 'Fredy',
        days_to_water: 3,
      });

      const formattedWaterDay = format(addDays(today, 3), 'dd/MM/yyyy');

      expect(updatedPlant.name).toEqual('Fredy');
      expect(updatedPlant.days_to_water).toEqual(3);

      expect(format(updatedPlant.water_day, 'dd/MM/yyyy')).toEqual(
        formattedWaterDay,
      );
    }

    expect(plant).not.toBeUndefined();
  });
});
