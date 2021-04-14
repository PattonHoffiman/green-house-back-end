"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

class AddNewColumnToUsersTable1614107256289 {
  async up(queryRunner) {
    await queryRunner.addColumn('users', new _typeorm.TableColumn({
      name: 'is_confirmed',
      type: 'boolean',
      isNullable: true,
      default: 'false'
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropColumn('users', 'is_confirmed');
  }

}

exports.default = AddNewColumnToUsersTable1614107256289;