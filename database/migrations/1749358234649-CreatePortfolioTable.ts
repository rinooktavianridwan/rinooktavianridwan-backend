import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortfolioTable1749358234649 implements MigrationInterface {
  name = 'CreatePortfolioTable1749358234649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`websiteUrl\` varchar(255) NULL, \`githubUrl\` varchar(255) NULL, \`documentationUrl\` varchar(255) NULL, \`technologies\` json NULL, \`isVisible\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`imageUrl\` varchar(255) NOT NULL, \`order\` int NOT NULL DEFAULT '0', \`projectId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_images\` ADD CONSTRAINT \`FK_a6efe5710e20ed5469e7719f074\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`project_images\` DROP FOREIGN KEY \`FK_a6efe5710e20ed5469e7719f074\``,
    );
    await queryRunner.query(`DROP TABLE \`project_images\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
  }
}
