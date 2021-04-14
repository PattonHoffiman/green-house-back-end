"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require("mongodb");

var _typeorm = require("typeorm");

var _Notification = _interopRequireDefault(require("../schemas/Notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NotificationsRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getMongoRepository)(_Notification.default, 'mongo');
  }

  async update(notification) {
    await this.ormRepository.save(notification);
  }

  async remove(notifications) {
    await this.ormRepository.remove(notifications);
  }

  async findById(id) {
    const o_id = new _mongodb.ObjectId(id);
    const notification = await this.ormRepository.findOne({
      where: {
        _id: o_id
      }
    });
    return notification;
  }

  async findAllByRecipientId(id) {
    const notifications = await this.ormRepository.find({
      where: {
        recipient_id: id
      }
    });
    return notifications.length === 0 ? undefined : notifications;
  }

  async create({
    read,
    content,
    recipient_id
  }) {
    const notification = this.ormRepository.create({
      read,
      content,
      recipient_id
    });
    await this.ormRepository.save(notification);
    return notification;
  }

}

exports.default = NotificationsRepository;