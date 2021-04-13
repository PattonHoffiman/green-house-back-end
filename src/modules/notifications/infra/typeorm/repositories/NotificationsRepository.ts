import { ObjectID, ObjectId } from 'mongodb';
import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '../schemas/Notification';

export default class NotificationsRepository
  implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async update(notification: Notification): Promise<void> {
    await this.ormRepository.save(notification);
  }

  public async remove(notifications: Notification[]): Promise<void> {
    await this.ormRepository.remove(notifications);
  }

  public async findById(id: ObjectID): Promise<Notification | undefined> {
    const o_id = new ObjectId(id);
    const notification = await this.ormRepository.findOne({
      where: { _id: o_id },
    });

    return notification;
  }

  public async findAllByRecipientId(
    id: string,
  ): Promise<Notification[] | undefined> {
    const notifications = await this.ormRepository.find({
      where: { recipient_id: id },
    });

    return notifications.length === 0 ? undefined : notifications;
  }

  public async create({
    read,
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      read,
      content,
      recipient_id,
    });
    await this.ormRepository.save(notification);
    return notification;
  }
}
