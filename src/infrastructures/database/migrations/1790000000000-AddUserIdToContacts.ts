import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToContacts1790000000000 implements MigrationInterface {
  name = 'AddUserIdToContacts1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add user_id column (nullable first for data migration)
    await queryRunner.query(
      `ALTER TABLE \`contacts\` ADD COLUMN \`user_id\` int NULL`,
    );

    // Add FK constraint
    await queryRunner.query(`
      ALTER TABLE \`contacts\`
      ADD CONSTRAINT \`FK_contact_user\`
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    `);

    // Update existing contacts to user_id = 1
    await queryRunner.query(`UPDATE \`contacts\` SET \`user_id\` = 1`);

    // Make user_id NOT NULL (now all rows have value)
    await queryRunner.query(
      `ALTER TABLE \`contacts\` MODIFY COLUMN \`user_id\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contacts\` DROP FOREIGN KEY \`FK_contact_user\``,
    );
    await queryRunner.query(`ALTER TABLE \`contacts\` DROP COLUMN \`user_id\``);
  }
}
