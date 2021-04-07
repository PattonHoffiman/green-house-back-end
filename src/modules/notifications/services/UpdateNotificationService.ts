import { ObjectID } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '../repositories/INotificationsRepository';

@injectable()
export default class UpdateNotificationService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(id: ObjectID): Promise<void> {
    const notification = await this.notificationsRepository.findById(id);

    if (!notification)
      throw new AppError('This notification does not exists!', 400);

    notification.read = true;
    await this.notificationsRepository.update(notification);
  }
}
