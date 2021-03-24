import path from 'path';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
export default class SendForgotPasswordEmailService {
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
      'retrieve',
    );

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'mails',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email,
      },
      subject: '[GreenHouse] Retrieve your Password',
      templateData: {
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
        file: forgotPasswordTemplate,
      },
    });
  }
}
