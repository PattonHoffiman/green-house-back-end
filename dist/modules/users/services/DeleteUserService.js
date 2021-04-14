"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IStorageProvider = _interopRequireDefault(require("../../../shared/container/providers/StorageProvider/models/IStorageProvider"));

var _IUsersRepository = _interopRequireDefault(require("../repositories/IUsersRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let DeleteUserService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('StorageProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IStorageProvider.default === "undefined" ? Object : _IStorageProvider.default, typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class DeleteUserService {
  constructor(cacheProvider, storageProvider, usersRepository) {
    this.cacheProvider = cacheProvider;
    this.storageProvider = storageProvider;
    this.usersRepository = usersRepository;
  }

  async execute(id) {
    const cacheKey = `user-plants:${id}`;
    const user = await this.usersRepository.findById(id);
    if (!user) throw new _AppError.default('This user does not exists!', 400);

    if (user.avatar_url) {
      this.storageProvider.deleteFile(user.avatar_url);
    }

    await this.usersRepository.delete(id);
    await this.cacheProvider.invalidate(cacheKey);
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
exports.default = DeleteUserService;