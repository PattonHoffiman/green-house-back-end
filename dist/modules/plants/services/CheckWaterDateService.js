"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IUsersRepository = _interopRequireDefault(require("../../users/repositories/IUsersRepository"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _INotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/INotificationsRepository"));

var _formatWaterDate = _interopRequireDefault(require("../utils/formatWaterDate"));

var _IPlantsRepository = _interopRequireDefault(require("../repositories/IPlantsRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CheckWaterDateService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('PlantsRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationsRepository')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default, typeof _IPlantsRepository.default === "undefined" ? Object : _IPlantsRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _INotificationsRepository.default === "undefined" ? Object : _INotificationsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class CheckWaterDateService {
  constructor(usersRepository, plantsRepository, cacheProvider, notificationsRepository) {
    this.usersRepository = usersRepository;
    this.plantsRepository = plantsRepository;
    this.cacheProvider = cacheProvider;
    this.notificationsRepository = notificationsRepository;
  }

  async execute(user_id) {
    const today = new Date();
    const existentNotifications = await this.notificationsRepository.findAllByRecipientId(user_id);

    if (existentNotifications) {
      const falseReadNotifications = existentNotifications.filter(notification => notification.read === false);
      const todayTrueReadNotifications = existentNotifications.filter(notification => {
        const created_at = new Date(notification.created_at);
        if (notification.read === true && today.getUTCDate() === created_at.getUTCDate() && today.getMonth() + 1 === created_at.getMonth() + 1) return notification;
      });
      if (falseReadNotifications.length !== 0 && todayTrueReadNotifications.length !== 0) return falseReadNotifications;
      if (falseReadNotifications.length === 0 && todayTrueReadNotifications.length !== 0) return null;
      if (falseReadNotifications.length !== 0 && todayTrueReadNotifications.length === 0) return falseReadNotifications;
    }

    let plants;
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new _AppError.default('This user does not exists!', 400);
    const cacheKey = `user-plants:${user_id}`;
    plants = await this.cacheProvider.recover(cacheKey);

    if (!plants) {
      plants = await this.plantsRepository.findAll(user_id);
      if (plants) await this.cacheProvider.save(cacheKey, (0, _classTransformer.classToClass)(plants));
    }

    if (plants) {
      const formatToday = (0, _dateFns.format)(today, 'yyyy-MM-dd');
      const plantsToWater = plants.filter(plant => {
        const water_day = (0, _formatWaterDate.default)(plant.water_day);
        if (formatToday === water_day) return plant;
      });
      const notifications = Promise.all(plantsToWater.map(async plant => {
        const water_day = (0, _formatWaterDate.default)(plant.water_day);
        const notification = await this.notificationsRepository.create({
          read: false,
          recipient_id: plant.user_id,
          content: `Don't forgot to water ${plant.name} today! [${water_day}]`
        });
        return notification;
      }));
      return notifications;
    }

    return null;
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
exports.default = CheckWaterDateService;