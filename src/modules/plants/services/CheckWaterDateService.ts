import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import formatWaterDate from '../utils/formatWaterDate';
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
    const today = new Date();

    const existentNotifications = await this.notificationsRepository.findAllByRecipientId(
      user_id,
    );

    if (existentNotifications) {
      const falseReadNotifications = existentNotifications.filter(
        notification => notification.read === false,
      );

      const todayTrueReadNotifications = existentNotifications.filter(
        notification => {
          const created_at = new Date(notification.created_at);

          if (
            notification.read === true &&
            today.getUTCDate() === created_at.getUTCDate() &&
            today.getMonth() + 1 === created_at.getMonth() + 1
          )
            return notification;
        },
      );

      if (
        falseReadNotifications.length !== 0 &&
        todayTrueReadNotifications.length !== 0
      )
        return falseReadNotifications;

      if (
        falseReadNotifications.length === 0 &&
        todayTrueReadNotifications.length !== 0
      )
        return null;

      if (
        falseReadNotifications.length !== 0 &&
        todayTrueReadNotifications.length === 0
      )
        return falseReadNotifications;
    }

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
        const water_day = formatWaterDate(plant.water_day);
        if (formatToday === water_day) return plant;
      });

      const notifications = Promise.all(
        plantsToWater.map(async plant => {
          const water_day = formatWaterDate(plant.water_day);
          const notification = await this.notificationsRepository.create({
            read: false,
            recipient_id: plant.user_id,
            content: `Don't forgot to water ${plant.name} today! [${water_day}]`,
          });

          return notification;
        }),
      );

      return notifications;
    }

    return null;
  }
}
