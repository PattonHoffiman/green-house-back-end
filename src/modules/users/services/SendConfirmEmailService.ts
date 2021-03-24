import path from 'path';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
export default class SendConfirmEmailService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(email: string): Promise<void> {
    const existentEmail = await this.usersRepository.findByEmail(email);

    if (!existentEmail) throw new AppError('This user does not exists', 400);

    const user = existentEmail;

    const { token } = await this.userTokensRepository.generate(
      user.id,
      'confirm',
    );

    const confirmEmailTemplate = path.resolve(
      __dirname,
      '..',
      'mails',
      'views',
      'confirm_email.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        email,
        name: user.name,
      },
      subject: '[GreenHouse] Confirm your E-mail',
      templateData: {
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/confirm-email?token=${token}`,
        },
        file: confirmEmailTemplate,
      },
    });
  }
}
