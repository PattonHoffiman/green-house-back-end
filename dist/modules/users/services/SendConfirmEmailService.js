"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IMailProvider = _interopRequireDefault(require("../../../shared/container/providers/MailProvider/models/IMailProvider"));

var _IUsersRepository = _interopRequireDefault(require("../repositories/IUsersRepository"));

var _IUserTokensRepository = _interopRequireDefault(require("../repositories/IUserTokensRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SendConfirmEmailService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('MailProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('UserTokensRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IMailProvider.default === "undefined" ? Object : _IMailProvider.default, typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default, typeof _IUserTokensRepository.default === "undefined" ? Object : _IUserTokensRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class SendConfirmEmailService {
  constructor(mailProvider, usersRepository, userTokensRepository) {
    this.mailProvider = mailProvider;
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
  }

  async execute(email) {
    const existentEmail = await this.usersRepository.findByEmail(email);
    if (!existentEmail) throw new _AppError.default('This user does not exists', 400);
    const user = existentEmail;
    const {
      token
    } = await this.userTokensRepository.generate(user.id, 'confirm');

    const confirmEmailTemplate = _path.default.resolve(__dirname, '..', 'mails', 'views', 'confirm_email.hbs');

    await this.mailProvider.sendMail({
      to: {
        email,
        name: user.name
      },
      subject: '[GreenHouse] Confirm your E-mail',
      templateData: {
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/confirm-email?token=${token}`
        },
        file: confirmEmailTemplate
      }
    });
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
exports.default = SendConfirmEmailService;