import { addDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPlantsRepository from '../repositories/IPlantsRepository';
import ICreatePlantDTO from '../dtos/ICreatePlantDTO';

@injectable()
export default class CreatePlantService {
  constructor(
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
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('This user does not exists!', 400);

    const today = new Date();
    const water_day = addDays(today, days_to_water);

    await this.plantsRepository.create(user_id, name, days_to_water, water_day);
  }
}
