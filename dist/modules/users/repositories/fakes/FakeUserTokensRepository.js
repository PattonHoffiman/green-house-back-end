"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuid = require("uuid");

var _UserToken = _interopRequireDefault(require("../../infra/typeorm/entities/UserToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FakeUserTokensRepository {
  constructor() {
    this.userTokens = [];
  }

  async remove(id) {
    this.userTokens = this.userTokens.filter(userToken => userToken.id !== id);
  }

  async generate(user_id, type) {
    const userToken = new _UserToken.default();
    Object.assign(userToken, {
      type,
      user_id,
      id: (0, _uuid.v4)(),
      token: 'fake-token',
      created_at: new Date(),
      updated_at: new Date()
    });
    this.userTokens.push(userToken);
    return userToken;
  }

  async findByToken(token) {
    const userToken = this.userTokens.find(findToken => findToken.token === token);
    return userToken;
  }

}

exports.default = FakeUserTokensRepository;