import { MigrationInterface, TableColumn, QueryRunner } from 'typeorm';

export default class AddNewColumnToUsersTable1614107256289
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_confirmed',
        type: 'boolean',
        isNullable: true,
        default: 'false',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'is_confirmed');
  }
}
