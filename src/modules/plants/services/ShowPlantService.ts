import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IShowPlantDTO from '../dtos/IShowPlantDTO';
import verifyPlantDate from '../utils/verifyPlantDate';
import IPlantsRepository from '../repositories/IPlantsRepository';

@injectable()
export default class ShowPlantService {
  constructor(
    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute(id: string): Promise<IShowPlantDTO> {
    const plant = await this.plantsRepository.findById(id);

    if (!plant) throw new AppError('This plants does not exists!', 400);

    const { water_last_time, water_next_time } = verifyPlantDate(
      plant.created_at,
      plant.updated_at,
      plant.days_to_water,
    );

    return {
      plant,
      water_last_time,
      water_next_time,
    };
  }
}
