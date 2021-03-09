import IParseTemplate from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseTemplate): Promise<string>;
}
