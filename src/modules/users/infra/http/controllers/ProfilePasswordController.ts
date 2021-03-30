import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import UpdateUserPasswordService from '@modules/users/services/UpdateUserPasswordService';

export default class ProfilePasswordController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { password, new_password, confirm_password } = req.body;
    const updateUserPassword = container.resolve(UpdateUserPasswordService);

    const user = await updateUserPassword.execute({
      id,
      password,
      new_password,
      confirm_password,
    });

    return res.status(200).send({
      status: 'success',
      user: classToClass(user),
      message: "Successfully user's password updated",
    });
  }
}
