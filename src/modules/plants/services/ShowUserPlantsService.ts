import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import Plant from '../infra/typeorm/entities/Plant';
import IPlantsRepository from '../repositories/IPlantsRepository';

@injectable()
export default class ShowUserPlantsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute(user_id: string): Promise<Plant[] | null> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('This user does not exists!', 400);

    const plants = await this.plantsRepository.findAll(user_id);

    return plants !== undefined ? plants : null;
  }
}
