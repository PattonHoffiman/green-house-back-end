import 'reflect-metadata';
import { addDays, format } from 'date-fns';

import AppError from '@shared/errors/AppError';
import ShowPlantService from '../ShowPlantService';
import FakePlantsRepository from '../../repositories/fakes/FakePlantsRepository';

let showPlant: ShowPlantService;
let fakePlantsRepository: FakePlantsRepository;

describe('Show Plant Service', () => {
  beforeEach(() => {
    fakePlantsRepository = new FakePlantsRepository();
    showPlant = new ShowPlantService(fakePlantsRepository);
  });

  it('should be able to show a plant', async () => {
    const today = new Date();
    await fakePlantsRepository.create('user-id', 'Fredy', 3, addDays(today, 3));

    const plant = fakePlantsRepository.plants.find(
      plantArray => plantArray.name === 'Fredy',
    );

    if (plant) {
      const findPlant = await showPlant.execute(plant.id);
      expect(plant).toEqual(findPlant.plant);
      expect(findPlant.water_last_time).toEqual('None');
      expect(findPlant.water_next_time).toEqual(
        format(addDays(today, 3), 'dd/MM/yyyy'),
      );
    }

    expect(plant).not.toBeUndefined();
  });

  it("should not be able to show if the plant doesn't exists", async () => {
    await expect(showPlant.execute('fake-id')).rejects.toBeInstanceOf(AppError);
  });
});
