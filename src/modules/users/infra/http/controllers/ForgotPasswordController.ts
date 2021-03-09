import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ResetPasswordService from '@modules/users/services/ResetPasswordsService';
import SendForgotPasswordEmail from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const sendMail = container.resolve(SendForgotPasswordEmail);

    const link = await sendMail.execute(email);

    return res.status(201).send({
      status: 'success',
      message: 'The email was successfully sent, please check your mailbox',
      link,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { token, password, password_confirmation } = req.body;
    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({ token, password, password_confirmation });

    return res.status(200).send({
      status: 'success',
      message: 'The password was changed successfully',
    });
  }
}
