import { addDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Plant from '../infra/typeorm/entities/Plant';
import IPlantsRepository from '../repositories/IPlantsRepository';
import IUpdatePlantDTO from '../dtos/IUpdatePlantDTO';

@injectable()
export default class UpdatePlantService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute({
    id,
    name,
    user_id,
    days_to_water,
  }: IUpdatePlantDTO): Promise<Plant> {
    const cacheKey = `user-plants:${user_id}`;
    const plant = await this.plantsRepository.findById(id);

    if (!plant) throw new AppError('This plant does not exists!', 400);

    plant.name = name;
    plant.updated_at = new Date();

    if (plant.days_to_water !== days_to_water) {
      const today = new Date();
      plant.days_to_water = days_to_water;
      plant.water_day = addDays(today, days_to_water);
    }

    await this.plantsRepository.save(plant);

    const plants = await this.cacheProvider.recover<Plant[]>(cacheKey);

    if (plants) {
      const updatedPlants = plants.map(plantArray => {
        if (plantArray.id === plant.id) {
          plantArray.name = plant.name;
          plantArray.water_day = plant.water_day;
          plantArray.updated_at = plant.updated_at;
          plantArray.days_to_water = plant.days_to_water;
        }

        return plantArray;
      });

      await this.cacheProvider.invalidate(cacheKey);
      await this.cacheProvider.save(cacheKey, classToClass(updatedPlants));
    }

    return plant;
  }
}
