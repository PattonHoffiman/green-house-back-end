import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import ShowPlantService from '@modules/plants/services/ShowPlantService';
import UpdatePlantService from '@modules/plants/services/UpdatePlantService';
import DeletePlantService from '@modules/plants/services/DeletePlantService';

export default class PlantProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { plant_id } = req.params;
    const showPlant = container.resolve(ShowPlantService);
    const data = await showPlant.execute(plant_id);

    return res.status(200).send({
      plant: classToClass(data.plant),
      water_last_time: data.water_last_time,
      water_next_time: data.water_next_time,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const { plant_id } = req.params;
    const updatePlant = container.resolve(UpdatePlantService);
    const updatedPlant = await updatePlant.execute({
      id: plant_id,
      name: data.name,
      days_to_water: data.days_to_water,
    });

    return res.status(200).send({
      status: 'success',
      plant: classToClass(updatedPlant),
      message: "Successfully user's plant updated",
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { plant_id } = req.params;
    const deletePlant = container.resolve(DeletePlantService);
    await deletePlant.execute(plant_id);

    return res.status(200).send({
      status: 'success',
      message: "Successfully user's plant deleted",
    });
  }
}
