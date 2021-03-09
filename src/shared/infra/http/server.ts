import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import { errors } from 'celebrate';
import uploadConfig from '@config/upload.config';
import routes from './routes';

import globalException from './middlewares/globalExceptionHandler';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);
app.use(errors);
app.use(globalException);

app.listen(3333, () => {
  console.log('Server Started on Port: 3333');
});
