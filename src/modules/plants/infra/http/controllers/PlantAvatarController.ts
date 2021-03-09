import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import UpdatePlantAvatarService from '@modules/plants/services/UpdatePlantAvatarService';

export default class PlantAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { plant_id } = req.params;
    const { filename } = req.file;
    const updateAvatar = container.resolve(UpdatePlantAvatarService);

    const plant = await updateAvatar.execute({
      plant_id,
      avatar_filename: filename,
    });

    return res.status(200).send({
      status: 'success',
      plant: classToClass(plant),
      message: "Successfully user's plant avatar updated",
    });
  }
}
