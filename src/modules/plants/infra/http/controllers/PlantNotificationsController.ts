import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CheckWaterDateService from '@modules/plants/services/CheckWaterDateService';
import DeleteNotificationService from '@modules/notifications/services/DeleteNotificationService';
import UpdateNotificationService from '@modules/notifications/services/UpdateNotificationService';

export default class PlantNotificationsController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const getNotification = container.resolve(CheckWaterDateService);

    const notifications = await getNotification.execute(id);

    if (!notifications) return res.status(204).send();

    return res.status(200).send(notifications);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.body;
    const updateNotification = container.resolve(UpdateNotificationService);

    await updateNotification.execute(id);

    return res.status(204).send();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id: recipient_id } = req.user;
    const deleteNotification = container.resolve(DeleteNotificationService);

    await deleteNotification.execute(recipient_id);

    return res.status(204).send();
  }
}
