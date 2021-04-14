"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _mongodb = require("mongodb");

var _Notification = _interopRequireDefault(require("../../infra/typeorm/schemas/Notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NotificationsRepository {
  constructor() {
    this.notifications = [];
  }

  async update(notification) {
    const updatedNotifications = this.notifications.map(notificationArray => {
      if (notificationArray.id === notification.id) {
        notificationArray = notification;
      }

      return notificationArray;
    });
    this.notifications = updatedNotifications;
  }

  async remove(notifications) {
    const fake = notifications;
    let updatedNotifications = this.notifications.filter(notification => notification.read === false);
    this.notifications = updatedNotifications;
    updatedNotifications = fake;
  }

  async findById(id) {
    const notification = this.notifications.find(notificationArray => notificationArray.id === id);
    return notification;
  }

  async findAllByRecipientId(id) {
    const today = (0, _dateFns.format)(new Date(), 'yyyy-MM-dd');
    const todayNotifications = this.notifications.filter(notification => notification.recipient_id === id).filter(notification => (0, _dateFns.format)(notification.created_at, 'yyyy-MM-dd') === today).filter(notification => notification.read === false);
    return todayNotifications.length === 0 ? undefined : todayNotifications;
  }

  async create({
    content,
    recipient_id
  }) {
    const notification = new _Notification.default();
    Object.assign(notification, {
      id: new _mongodb.ObjectID(),
      content,
      recipient_id
    });
    this.notifications.push(notification);
    return notification;
  }

}

exports.default = NotificationsRepository;