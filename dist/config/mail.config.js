"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'greenhouse@hoffimanportifolio.com.br',
      name: 'Team GreenHouse'
    }
  }
};
exports.default = _default;