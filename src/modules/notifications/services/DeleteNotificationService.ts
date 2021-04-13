import { inject, injectable } from 'tsyringe';

import INotificationsRepository from '../repositories/INotificationsRepository';

@injectable()
export default class DeleteNotificationService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(recipient_id: string): Promise<void> {
    const today = new Date();
    const notifications = await this.notificationsRepository.findAllByRecipientId(
      recipient_id,
    );

    if (notifications) {
      let updatedNotifications = notifications.filter(
        notification => notification.read === true,
      );

      updatedNotifications = updatedNotifications.filter(notification => {
        const created_at = new Date(notification.created_at);

        if (
          created_at.getFullYear() < today.getFullYear() ||
          created_at.getMonth() + 1 < today.getMonth() + 1 ||
          (created_at.getUTCDate() < today.getUTCDate() &&
            created_at.getMonth() + 1 === today.getMonth() + 1)
        )
          return notification;
      });

      await this.notificationsRepository.remove(updatedNotifications);
    }
  }
}
