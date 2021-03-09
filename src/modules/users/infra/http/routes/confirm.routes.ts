import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ConfirmEmailController from '../controllers/ConfirmEmailController';

const confirmRouter = Router();
const confirmEmailController = new ConfirmEmailController();

confirmRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  confirmEmailController.create,
);
confirmRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
    },
  }),
  confirmEmailController.update,
);

export default confirmRouter;
