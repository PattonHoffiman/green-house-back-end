import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import UpdatePlantAvatarService from '@modules/plants/services/UpdatePlantAvatarService';

export default class PlantAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { filename } = req.file;
    const { plant_id } = req.params;
    const updateAvatar = container.resolve(UpdatePlantAvatarService);

    const plant = await updateAvatar.execute({
      plant_id,
      user_id: id,
      avatar_filename: filename,
    });

    return res.status(200).send({
      status: 'success',
      plant: classToClass(plant),
      message: "Successfully user's plant avatar updated",
    });
  }
}
