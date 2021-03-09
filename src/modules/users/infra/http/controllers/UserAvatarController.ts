import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { filename } = req.file;
    const updateAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateAvatar.execute({
      user_id: id,
      avatar_filename: filename,
    });

    return res.status(200).send({
      status: 'success',
      user: classToClass(user),
      message: "Successfully user's avatar updated",
    });
  }
}
