import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderToProjects1788850600000 implements MigrationInterface {
  name = 'AddOrderToProjects1788850600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // `order` is a reserved keyword in MySQL, so the column must be backticked.
    // NOT NULL DEFAULT 0 is safe even when the table already has rows.
    // Existing rows simply get 0 and keep their current relative order via the
    // `created_at` tie-breaker; urutan can be set later per project.
    await queryRunner.query(
      `ALTER TABLE \`projects\` ADD \`order\` int NOT NULL DEFAULT 0 AFTER \`is_visible\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`order\``);
  }
}
