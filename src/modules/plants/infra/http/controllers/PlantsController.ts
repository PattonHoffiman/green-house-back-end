import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreatePlantService from '@modules/plants/services/CreatePlantService';

export default class PlantsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { name, days_to_water } = req.body;
    const createPlant = container.resolve(CreatePlantService);

    await createPlant.execute({
      name,
      user_id: id,
      days_to_water,
    });

    return res.status(201).send({
      status: 'success',
      message: "Successfully user's plant created",
    });
  }
}
