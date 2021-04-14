"use strict";

var _tsyringe = require("tsyringe");

var _RedisCacheProvider = _interopRequireDefault(require("./implementations/RedisCacheProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('CacheProvider', _RedisCacheProvider.default);