import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  public messages: IMessage[] = [];

  public async sendMail(data: ISendMailDTO): Promise<void> {
    if (data.from) throw new Error();

    this.messages.push({
      to: data.to.email,
      body: 'fake-message',
    });
  }
}
