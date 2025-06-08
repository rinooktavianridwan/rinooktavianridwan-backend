import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactTable1749358212764 implements MigrationInterface {
  name = 'CreateContactTable1749358212764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`contacts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`platformName\` varchar(50) NOT NULL, \`url\` varchar(255) NOT NULL, \`iconUrl\` varchar(255) NOT NULL, \`color\` varchar(10) NULL, \`order\` int NOT NULL DEFAULT '0', \`isVisible\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b0366f5a66511fc6b19bc7d150\` (\`platformName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b0366f5a66511fc6b19bc7d150\` ON \`contacts\``,
    );
    await queryRunner.query(`DROP TABLE \`contacts\``);
  }
}
