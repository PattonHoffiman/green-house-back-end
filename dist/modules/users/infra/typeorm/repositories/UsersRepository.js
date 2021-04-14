"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _User = _interopRequireDefault(require("../entities/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_User.default);
  }

  async save(user) {
    await this.ormRepository.save(user);
  }

  async delete(id) {
    await this.ormRepository.delete(id);
  }

  async findById(id) {
    const findUser = await this.ormRepository.findOne(id);
    return findUser;
  }

  async findByEmail(email) {
    const findUser = await this.ormRepository.findOne({
      where: {
        email
      }
    });
    return findUser;
  }

  async create(name, email, password) {
    const newUser = this.ormRepository.create({
      name,
      email,
      password
    });
    await this.ormRepository.save(newUser);
  }

}

exports.default = UsersRepository;