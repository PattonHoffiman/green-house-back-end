"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

class AddNewColumnToUserTokensTable1614197926888 {
  async up(queryRunner) {
    await queryRunner.addColumn('user_tokens', new _typeorm.TableColumn({
      name: 'type',
      type: 'enum',
      enum: ['confirm', 'retrieve']
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropColumn('user_tokens', 'type');
  }

}

exports.default = AddNewColumnToUserTokensTable1614197926888;