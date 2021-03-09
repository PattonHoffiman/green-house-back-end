import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import ShowUserPlantsService from '@modules/plants/services/ShowUserPlantsService';

export default class UserPlantsService {
  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const showUserPlants = container.resolve(ShowUserPlantsService);
    const plants = await showUserPlants.execute(id);

    if (!plants) return res.status(204).send();

    const classToClassPlants = plants.map(plant => classToClass(plant));
    return res.status(200).send(classToClassPlants);
  }
}
