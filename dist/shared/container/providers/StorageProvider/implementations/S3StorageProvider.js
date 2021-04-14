"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lite = _interopRequireDefault(require("mime/lite"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _upload = _interopRequireDefault(require("../../../../../config/upload.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DiskStorageProvider {
  constructor() {
    this.client = void 0;
    this.client = new _awsSdk.default.S3({
      region: 'sa-east-1'
    });
  }

  async saveFile(file) {
    const originalPath = _path.default.resolve(_upload.default.tempFolder, file);

    const ContentType = _lite.default.getType(originalPath);

    const fileContent = await _fs.default.promises.readFile(originalPath);

    if (!ContentType) {
      throw new Error('File Not Found');
    }

    await this.client.putObject({
      Bucket: _upload.default.config.aws.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType
    }).promise();
    await _fs.default.promises.unlink(originalPath);
    return file;
  }

  async deleteFile(file) {
    await this.client.deleteObject({
      Bucket: _upload.default.config.aws.bucket,
      Key: file
    }).promise();
  }

}

exports.default = DiskStorageProvider;