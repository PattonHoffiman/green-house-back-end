import { addDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Plant from '../infra/typeorm/entities/Plant';
import IPlantsRepository from '../repositories/IPlantsRepository';

import IUpdatePlantDTO from '../dtos/IUpdatePlantDTO';

@injectable()
export default class UpdatePlantService {
  constructor(
    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute({
    id,
    name,
    days_to_water,
  }: IUpdatePlantDTO): Promise<Plant> {
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
    return plant;
  }
}
