"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuid = require("uuid");

var _User = _interopRequireDefault(require("../../infra/typeorm/entities/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FakeUsersRepository {
  constructor() {
    this.users = [];
  }

  async save(user) {
    this.users = this.users.map(arrayUser => {
      if (arrayUser.id === user.id) return user;
      return arrayUser;
    });
  }

  async delete(id) {
    const updatedUsers = this.users.filter(user => user.id !== id);
    this.users = updatedUsers;
  }

  async findById(id) {
    const user = this.users.find(user => user.id === id);
    return user;
  }

  async findByEmail(email) {
    const user = this.users.find(user => user.email === email);
    return user;
  }

  async create(name, email, password) {
    const user = new _User.default();
    Object.assign(user, {
      name,
      email,
      password,
      id: (0, _uuid.v4)(),
      created_at: new Date(),
      updated_at: new Date(),
      is_confirmed: false
    });
    this.users.push(user);
  }

}

exports.default = FakeUsersRepository;