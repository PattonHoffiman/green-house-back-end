import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import PlantsController from '../controllers/PlantsController';
import UserPlantsController from '../controllers/UserPlantsController';

const plantsRoutes = Router();
const plantsController = new PlantsController();
const userPlantsController = new UserPlantsController();

plantsRoutes.get('/', ensureAuthenticated, userPlantsController.index);

plantsRoutes.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      days_to_water: Joi.number().max(60).min(1).required(),
    },
  }),
  plantsController.create,
);

export default plantsRoutes;
