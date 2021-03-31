import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Plant from '../infra/typeorm/entities/Plant';
import IPlantsRepository from '../repositories/IPlantsRepository';

@injectable()
export default class ShowUserPlantsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(user_id: string): Promise<Plant[] | null> {
    let plants: Plant[] | null | undefined;
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('This user does not exists!', 400);

    const cacheKey = `user-plants:${user_id}`;

    plants = await this.cacheProvider.recover<Plant[]>(cacheKey);

    if (!plants) {
      plants = await this.plantsRepository.findAll(user_id);

      if (plants) await this.cacheProvider.save(cacheKey, classToClass(plants));
    }

    return plants !== undefined ? plants : null;
  }
}
