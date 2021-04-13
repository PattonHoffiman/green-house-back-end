import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import VerifyWaterDayDateService from '@modules/plants/services/VerifyWaterDayDateService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const authenticateUser = container.resolve(AuthenticateUserService);
    const verifyWaterDayDate = container.resolve(VerifyWaterDayDateService);

    const { user, token } = await authenticateUser.execute({ email, password });
    await verifyWaterDayDate.execute(user.id);

    return res.status(200).send({
      token,
      status: 'success',
      user: classToClass(user),
      message: `Welcome ${user.name}`,
    });
  }
}
