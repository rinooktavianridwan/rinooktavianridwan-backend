import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sh1754552622463 implements MigrationInterface {
  name = 'Sh1754552622463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`email\` varchar(100) NULL, \`name\` varchar(100) NULL, \`bio\` text NULL, \`profilePictureUrl\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`websiteUrl\` varchar(255) NULL, \`githubUrl\` varchar(255) NULL, \`documentationUrl\` varchar(255) NULL, \`technologies\` json NULL, \`isVisible\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`imageUrl\` varchar(255) NOT NULL, \`order\` int NOT NULL DEFAULT '0', \`projectId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`contacts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`platformName\` varchar(50) NOT NULL, \`url\` varchar(255) NOT NULL, \`iconUrl\` varchar(255) NOT NULL, \`color\` varchar(10) NULL, \`order\` int NOT NULL DEFAULT '0', \`isVisible\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b0366f5a66511fc6b19bc7d150\` (\`platformName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_images\` ADD CONSTRAINT \`FK_a6efe5710e20ed5469e7719f074\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`project_images\` DROP FOREIGN KEY \`FK_a6efe5710e20ed5469e7719f074\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b0366f5a66511fc6b19bc7d150\` ON \`contacts\``,
    );
    await queryRunner.query(`DROP TABLE \`contacts\``);
    await queryRunner.query(`DROP TABLE \`project_images\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
