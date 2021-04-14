"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _UserToken = _interopRequireDefault(require("../entities/UserToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserTokenRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_UserToken.default);
  }

  async remove(id) {
    await this.ormRepository.delete(id);
  }

  async generate(user_id, type) {
    const userToken = this.ormRepository.create({
      user_id,
      type
    });
    await this.ormRepository.save(userToken);
    return userToken;
  }

  async findByToken(token) {
    const findUserToken = await this.ormRepository.findOne({
      where: {
        token
      }
    });
    return findUserToken;
  }

}

exports.default = UserTokenRepository;