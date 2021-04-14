"use strict";

var _tsyringe = require("tsyringe");

require("./providers");

require("../../modules/users/providers");

var _UsersRepository = _interopRequireDefault(require("../../modules/users/infra/typeorm/repositories/UsersRepository"));

var _UserTokensRepository = _interopRequireDefault(require("../../modules/users/infra/typeorm/repositories/UserTokensRepository"));

var _PlantsRepository = _interopRequireDefault(require("../../modules/plants/infra/typeorm/repositories/PlantsRepository"));

var _NotificationsRepository = _interopRequireDefault(require("../../modules/notifications/infra/typeorm/repositories/NotificationsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('UsersRepository', _UsersRepository.default);

_tsyringe.container.registerSingleton('PlantsRepository', _PlantsRepository.default);

_tsyringe.container.registerSingleton('UserTokensRepository', _UserTokensRepository.default);

_tsyringe.container.registerSingleton('NotificationsRepository', _NotificationsRepository.default);