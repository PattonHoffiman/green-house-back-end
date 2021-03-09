import { container } from 'tsyringe';

import ITemplateMailProvider from './models/IMailTemplateProvider';
import HandlebarsTemplateMailProvider from './implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<ITemplateMailProvider>(
  'TemplateMailProvider',
  HandlebarsTemplateMailProvider,
);
