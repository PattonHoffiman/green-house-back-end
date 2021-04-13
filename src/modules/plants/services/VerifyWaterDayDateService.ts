import { addDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPlantsRepository from '../repositories/IPlantsRepository';

@injectable()
export default class VerifyWaterDayDateService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute(user_id: string): Promise<void> {
    const today = new Date();
    const cacheKey = `user-plants:${user_id}`;
    const plants = await this.plantsRepository.findAll(user_id);

    if (plants) {
      const updatedPlants = plants.map(plant => {
        const water_day = new Date(plant.water_day);

        if (
          water_day.getFullYear() === today.getFullYear() &&
          water_day.getMonth() + 1 === today.getMonth() + 1
        ) {
          if (water_day.getUTCDate() < today.getUTCDate()) {
            if (plant.days_to_water === 1) plant.water_day = today;
            else plant.water_day = addDays(today, plant.days_to_water);
          }
        } else if (
          water_day.getFullYear() < today.getFullYear() ||
          water_day.getMonth() + 1 < today.getMonth() + 1
        ) {
          if (plant.days_to_water === 1) plant.water_day = today;
          else plant.water_day = addDays(today, plant.days_to_water);
        }

        return plant;
      });

      await this.cacheProvider.invalidate(cacheKey);
      await this.plantsRepository.saveAll(updatedPlants);
      await this.cacheProvider.save(cacheKey, classToClass(updatedPlants));
    }
  }
}
