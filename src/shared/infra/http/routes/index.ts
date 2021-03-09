import { Router } from 'express';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import plantsRoutes from '@modules/plants/infra/http/routes/plants.routes';
import confirmRoutes from '@modules/users/infra/http/routes/confirm.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';
import userAvatarRoutes from '@modules/users/infra/http/routes/avatar.routes';
import userProfileRoutes from '@modules/users/infra/http/routes/profile.routes';
import plantsAvatarRoutes from '@modules/plants/infra/http/routes/avatar.routes';
import plantsProfileRoutes from '@modules/plants/infra/http/routes/profile.routes';

const routes = Router();
routes.use('/users', usersRoutes);
routes.use('/plants', plantsRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/users/confirm', confirmRoutes);
routes.use('/users/password', passwordRoutes);
routes.use('/users/profile', userProfileRoutes);
routes.use('/plants/profile', plantsProfileRoutes);
routes.use('/users/profile/avatar', userAvatarRoutes);
routes.use('/plants/profile/avatar', plantsAvatarRoutes);

export default routes;
