"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _dateFns = require("date-fns");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IUsersRepository = _interopRequireDefault(require("../repositories/IUsersRepository"));

var _IUserTokensRepository = _interopRequireDefault(require("../repositories/IUserTokensRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ConfirmEmailService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('UserTokensRepository')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default, typeof _IUserTokensRepository.default === "undefined" ? Object : _IUserTokensRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class ConfirmEmailService {
  constructor(usersRepository, userTokensRepository) {
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
  }

  async execute(token) {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) throw new _AppError.default('User token does not exists', 400);
    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) throw new _AppError.default('User does not exist', 400);
    const tokenCreatedAt = userToken.created_at;
    const compareDate = (0, _dateFns.addHours)(tokenCreatedAt, 2);

    if ((0, _dateFns.isAfter)(Date.now(), compareDate)) {
      await this.userTokensRepository.remove(userToken.id);
      throw new _AppError.default('Token Expired', 401);
    }

    if (userToken.type !== 'confirm') {
      await this.userTokensRepository.remove(userToken.id);
      throw new _AppError.default("You don't have permission to do that", 401);
    }

    user.is_confirmed = true;
    await this.usersRepository.save(user);
    await this.userTokensRepository.remove(userToken.id);
  }

}) || _class) || _class) || _class) || _class) || _class);
exports.default = ConfirmEmailService;