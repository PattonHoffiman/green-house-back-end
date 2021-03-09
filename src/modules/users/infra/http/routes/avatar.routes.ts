import multer from 'multer';
import { Router } from 'express';

import uploadConfig from '@config/upload.config';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import UserAvatarController from '../controllers/UserAvatarController';

const avatarRouter = Router();
const upload = multer(uploadConfig.multer);
const userAvatarController = new UserAvatarController();

avatarRouter.patch(
  '/',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default avatarRouter;
