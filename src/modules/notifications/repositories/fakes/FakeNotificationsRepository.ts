import { format } from 'date-fns';
import { ObjectID } from 'mongodb';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '../../infra/typeorm/schemas/Notification';

export default class NotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async update(notification: Notification): Promise<void> {
    const updatedNotifications = this.notifications.map(notificationArray => {
      if (notificationArray.id === notification.id) {
        notificationArray = notification;
      }

      return notificationArray;
    });

    this.notifications = updatedNotifications;
  }

  public async remove(notifications: Notification[]): Promise<void> {
    const fake = notifications;
    let updatedNotifications = this.notifications.filter(
      notification => notification.read === false,
    );

    this.notifications = updatedNotifications;
    updatedNotifications = fake;
  }

  public async findById(id: ObjectID): Promise<Notification | undefined> {
    const notification = this.notifications.find(
      notificationArray => notificationArray.id === id,
    );

    return notification;
  }

  public async findAllByRecipientId(
    id: string,
  ): Promise<Notification[] | undefined> {
    const today = format(new Date(), 'yyyy-MM-dd');

    const todayNotifications = this.notifications
      .filter(notification => notification.recipient_id === id)
      .filter(
        notification => format(notification.created_at, 'yyyy-MM-dd') === today,
      )
      .filter(notification => notification.read === false);

    return todayNotifications.length === 0 ? undefined : todayNotifications;
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, { id: new ObjectID(), content, recipient_id });
    this.notifications.push(notification);
    return notification;
  }
}
