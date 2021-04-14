"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IUsersRepository = _interopRequireDefault(require("../repositories/IUsersRepository"));

var _IHashProvider = _interopRequireDefault(require("../providers/HashProvider/models/IHashProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdateUserPasswordService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('HashProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IHashProvider.default === "undefined" ? Object : _IHashProvider.default, typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class UpdateUserPasswordService {
  constructor(hashProvider, usersRepository) {
    this.hashProvider = hashProvider;
    this.usersRepository = usersRepository;
  }

  async execute({
    id,
    password,
    new_password,
    confirm_password
  }) {
    const checkExistentUser = await this.usersRepository.findById(id);
    if (!checkExistentUser) throw new _AppError.default('This user does not exists!', 400);
    const user = checkExistentUser;
    const passwordMatched = await this.hashProvider.compareHash(password, user.password);
    if (!passwordMatched) throw new _AppError.default('Incorrect password!', 401);
    if (new_password !== confirm_password) throw new _AppError.default('New password and password confirmation does not matches!', 400);
    user.password = new_password;
    await this.usersRepository.save(user);
    return user;
  }

}) || _class) || _class) || _class) || _class) || _class);
exports.default = UpdateUserPasswordService;