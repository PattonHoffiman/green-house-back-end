import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ConfirmEmailService from '@modules/users/services/ConfirmEmailService';
import SendConfirmEmailService from '@modules/users/services/SendConfirmEmailService';

export default class ConfirmEmailController {
  async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const sendMail = container.resolve(SendConfirmEmailService);

    const link = await sendMail.execute(email);

    return res.status(201).send({
      status: 'success',
      message: 'The email was successfully sent, please check your mailbox',
      link,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { token } = req.body;
    const confirmEmail = container.resolve(ConfirmEmailService);

    await confirmEmail.execute(token);

    return res.status(200).send({
      status: 'success',
      message: 'You successfully confirm your email',
    });
  }
}
