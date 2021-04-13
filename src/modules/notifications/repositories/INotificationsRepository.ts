import { ObjectID } from 'mongodb';
import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationRepository {
  update(notification: Notification): Promise<void>;
  remove(notifications: Notification[]): Promise<void>;
  findById(id: ObjectID): Promise<Notification | undefined>;
  create(data: ICreateNotificationDTO): Promise<Notification>;
  findAllByRecipientId(id: string): Promise<Notification[] | undefined>;
}
