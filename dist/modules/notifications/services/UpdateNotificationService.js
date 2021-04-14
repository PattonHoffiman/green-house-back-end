"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _INotificationsRepository = _interopRequireDefault(require("../repositories/INotificationsRepository"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdateNotificationService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationsRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _INotificationsRepository.default === "undefined" ? Object : _INotificationsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class UpdateNotificationService {
  constructor(notificationsRepository) {
    this.notificationsRepository = notificationsRepository;
  }

  async execute(id) {
    const notification = await this.notificationsRepository.findById(id);
    if (!notification) throw new _AppError.default('This notification does not exists!', 400);
    notification.read = true;
    await this.notificationsRepository.update(notification);
  }

}) || _class) || _class) || _class) || _class);
exports.default = UpdateNotificationService;