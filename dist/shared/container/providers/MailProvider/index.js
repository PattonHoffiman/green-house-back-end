"use strict";

var _tsyringe = require("tsyringe");

var _mail = _interopRequireDefault(require("../../../../config/mail.config"));

var _SESMailProvider = _interopRequireDefault(require("./implementations/SESMailProvider"));

var _EtherealMailProvider = _interopRequireDefault(require("./implementations/EtherealMailProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const providers = {
  ses: _tsyringe.container.resolve(_SESMailProvider.default),
  ethereal: _tsyringe.container.resolve(_EtherealMailProvider.default)
};

_tsyringe.container.registerInstance('MailProvider', providers[_mail.default.driver]);