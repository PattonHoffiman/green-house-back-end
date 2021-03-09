import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import UpdateUserService from '@modules/users/services/UpdateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute(id);
    return res.status(200).send(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { name, email } = req.body;
    const updateUser = container.resolve(UpdateUserService);
    const user = await updateUser.execute({ id, name, email });

    return res.status(200).send({
      status: 'success',
      user: classToClass(user),
      message: "Successfully user's account updated",
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const deleteUser = container.resolve(DeleteUserService);
    await deleteUser.execute(id);

    return res.status(204).send({
      status: 'success',
      message: "Successfully user's account deleted",
    });
  }
}
