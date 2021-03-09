import { MigrationInterface, TableColumn, QueryRunner } from 'typeorm';

export default class AddNewColumnToUserTokensTable1614197926888
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_tokens',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['confirm', 'retrieve'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_tokens', 'type');
  }
}
