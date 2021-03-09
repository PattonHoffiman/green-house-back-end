import { container } from 'tsyringe';
import mailConfig from '@config/mail.config';

import IMailProvider from './models/IMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';

const providers = {
  ses: container.resolve(SESMailProvider),
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
