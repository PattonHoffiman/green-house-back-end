import multer from 'multer';
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload.config';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import PlantAvatarController from '../controllers/PlantAvatarController';

const avatarRouter = Router();
const upload = multer(uploadConfig.multer);
const plantAvatarController = new PlantAvatarController();

avatarRouter.patch(
  '/:plant_id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      plant_id: Joi.string().uuid().required(),
    },
  }),
  upload.single('avatar'),
  plantAvatarController.update,
);

export default avatarRouter;
