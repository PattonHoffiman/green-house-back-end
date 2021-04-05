import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import IPlantsRepository from '../repositories/IPlantsRepository';

import Plant from '../infra/typeorm/entities/Plant';

@injectable()
export default class CheckWaterDateService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(user_id: string): Promise<Notification[] | null> {
    const existentNotifications = await this.notificationsRepository.findAllByRecipientId(
      user_id,
    );

    if (existentNotifications) {
      const falseReadNotifications = existentNotifications.filter(
        notification => notification.read === false,
      );

      if (falseReadNotifications.length !== 0) return falseReadNotifications;
    }

    const today = new Date();
    let plants: Plant[] | null | undefined;
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('This user does not exists!', 400);

    const cacheKey = `user-plants:${user_id}`;

    plants = await this.cacheProvider.recover<Plant[]>(cacheKey);

    if (!plants) {
      plants = await this.plantsRepository.findAll(user_id);

      if (plants) await this.cacheProvider.save(cacheKey, classToClass(plants));
    }

    if (plants) {
      const formatToday = format(today, 'yyyy-MM-dd');

      const plantsToWater = plants.filter(plant => {
        if (formatToday === plant.water_day.toString()) return plant;
      });

      const notifications = Promise.all(
        plantsToWater.map(async plant => {
          const notification = await this.notificationsRepository.create({
            read: false,
            recipient_id: plant.user_id,
            content: `Don't forgot to water ${plant.name} today! [${plant.water_day}])`,
          });

          return notification;
        }),
      );

      return notifications;
    }

    return null;
  }
}
