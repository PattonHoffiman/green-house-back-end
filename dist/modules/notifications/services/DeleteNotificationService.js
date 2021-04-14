"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _INotificationsRepository = _interopRequireDefault(require("../repositories/INotificationsRepository"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let DeleteNotificationService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationsRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _INotificationsRepository.default === "undefined" ? Object : _INotificationsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class DeleteNotificationService {
  constructor(notificationsRepository) {
    this.notificationsRepository = notificationsRepository;
  }

  async execute(recipient_id) {
    const today = new Date();
    const notifications = await this.notificationsRepository.findAllByRecipientId(recipient_id);

    if (notifications) {
      let updatedNotifications = notifications.filter(notification => notification.read === true);
      updatedNotifications = updatedNotifications.filter(notification => {
        const created_at = new Date(notification.created_at);
        if (created_at.getFullYear() < today.getFullYear() || created_at.getMonth() + 1 < today.getMonth() + 1 || created_at.getUTCDate() < today.getUTCDate() && created_at.getMonth() + 1 === today.getMonth() + 1) return notification;
      });
      await this.notificationsRepository.remove(updatedNotifications);
    }
  }

}) || _class) || _class) || _class) || _class);
exports.default = DeleteNotificationService;