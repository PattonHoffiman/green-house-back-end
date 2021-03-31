import { addDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import Plant from '@modules/plants/infra/typeorm/entities/Plant';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPlantsRepository from '../repositories/IPlantsRepository';
import ICreatePlantDTO from '../dtos/ICreatePlantDTO';

@injectable()
export default class CreatePlantService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute({
    name,
    user_id,
    days_to_water,
  }: ICreatePlantDTO): Promise<void> {
    const cacheKey = `user-plants:${user_id}`;
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('This user does not exists!', 400);

    const today = new Date();
    const water_day = addDays(today, days_to_water);

    const plant = await this.plantsRepository.create(
      user_id,
      name,
      days_to_water,
      water_day,
    );

    const plants = await this.cacheProvider.recover<Plant[]>(cacheKey);

    if (plants) {
      plants.push(plant);
      await this.cacheProvider.invalidate(cacheKey);
      await this.cacheProvider.save(cacheKey, classToClass(plants));
    }
  }
}
