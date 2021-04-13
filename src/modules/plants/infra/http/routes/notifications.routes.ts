import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import PlantNotificationsController from '../controllers/PlantNotificationsController';

const plantNotificationsRouter = Router();
const plantNotificationsController = new PlantNotificationsController();

plantNotificationsRouter.get(
  '/',
  ensureAuthenticated,
  plantNotificationsController.show,
);

plantNotificationsRouter.put(
  '/',
  ensureAuthenticated,
  plantNotificationsController.update,
);

plantNotificationsRouter.delete(
  '/',
  ensureAuthenticated,
  plantNotificationsController.delete,
);

export default plantNotificationsRouter;
