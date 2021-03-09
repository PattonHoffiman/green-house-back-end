import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';
import ProfilePasswordController from '../controllers/ProfilePasswordController';

const profileRouter = Router();

const profileController = new ProfileController();
const profilePasswordController = new ProfilePasswordController();

profileRouter.get('/', ensureAuthenticated, profileController.show);

profileRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  profileController.update,
);

profileRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
      new_password: Joi.string().required(),
      confirm_password: Joi.string().required(),
    },
  }),
  profilePasswordController.update,
);

profileRouter.delete('/', ensureAuthenticated, profileController.delete);

export default profileRouter;
