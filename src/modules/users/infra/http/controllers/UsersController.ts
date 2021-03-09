import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const createUser = container.resolve(CreateUserService);

    await createUser.execute(data);
    return res.status(201).send({
      status: 'success',
      message: "Successfully user's account created",
    });
  }
}
