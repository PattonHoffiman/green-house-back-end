import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();

passwordRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);
passwordRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
      token: Joi.string().uuid().required(),
      password_confirmation: Joi.string().required(),
    },
  }),
  forgotPasswordController.update,
);

export default passwordRouter;
