import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  subject: string;
  to: IMailContact;
  from?: IMailContact;
  templateData: IParseMailTemplateDTO;
}
