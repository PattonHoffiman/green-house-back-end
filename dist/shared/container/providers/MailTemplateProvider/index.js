"use strict";

var _tsyringe = require("tsyringe");

var _HandlebarsMailTemplateProvider = _interopRequireDefault(require("./implementations/HandlebarsMailTemplateProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('TemplateMailProvider', _HandlebarsMailTemplateProvider.default);