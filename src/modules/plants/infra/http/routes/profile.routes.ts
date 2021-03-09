import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import PlantProfileController from '../controllers/PlantProfileController';

const profileRouter = Router();

const plantProfileController = new PlantProfileController();

profileRouter.get(
  '/:plant_id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      plant_id: Joi.string().uuid().required(),
    },
  }),
  plantProfileController.show,
);

profileRouter.put(
  '/:plant_id',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      days_to_water: Joi.number().max(60).min(1).required(),
    },
    [Segments.PARAMS]: {
      plant_id: Joi.string().uuid().required(),
    },
  }),
  plantProfileController.update,
);

profileRouter.delete(
  '/:plant_id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      plant_id: Joi.string().uuid().required(),
    },
  }),
  plantProfileController.delete,
);

export default profileRouter;
