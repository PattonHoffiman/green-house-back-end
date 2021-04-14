"use strict";

var _tsyringe = require("tsyringe");

var _upload = _interopRequireDefault(require("../../../../config/upload.config"));

var _S3StorageProvider = _interopRequireDefault(require("./implementations/S3StorageProvider"));

var _DiskStorageProvider = _interopRequireDefault(require("./implementations/DiskStorageProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const providers = {
  s3: _tsyringe.container.resolve(_S3StorageProvider.default),
  disk: _tsyringe.container.resolve(_DiskStorageProvider.default)
};

_tsyringe.container.registerInstance('StorageProvider', providers[_upload.default.driver]);