"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

class CreatePlantsTable1615305549650 {
  async up(queryRunner) {
    await queryRunner.createTable(new _typeorm.Table({
      name: 'plants',
      columns: [{
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()'
      }, {
        name: 'user_id',
        type: 'uuid'
      }, {
        name: 'name',
        type: 'varchar'
      }, {
        name: 'avatar_url',
        type: 'varchar',
        isNullable: true
      }, {
        name: 'days_to_water',
        type: 'integer'
      }, {
        name: 'water_day',
        type: 'timestamp'
      }, {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()'
      }, {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()'
      }],
      foreignKeys: [{
        name: 'PlantUser',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        columnNames: ['user_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }]
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropTable('plants');
  }

}

exports.default = CreatePlantsTable1615305549650;