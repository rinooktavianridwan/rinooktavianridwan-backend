import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1754552622463 implements MigrationInterface {
  name = 'InitDatabase1754552622463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(50) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`email\` varchar(100) NULL,
        \`name\` varchar(255) NULL,
        \`bio\` text NULL,
        \`profile_picture_url\` varchar(255) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        CONSTRAINT \`UQ_username\` UNIQUE (\`username\`),
        CONSTRAINT \`UQ_email\` UNIQUE (\`email\`),
        PRIMARY KEY (\`id\`)
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`website_url\` varchar(255) NULL,
        \`github_url\` varchar(255) NULL,
        \`documentation_url\` varchar(255) NULL,
        \`is_visible\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        \`user_id\` int NULL,
        CONSTRAINT \`FK_project_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL,
        PRIMARY KEY (\`id\`)
      )
    `);

    // Create project_images table
    await queryRunner.query(`
      CREATE TABLE \`project_images\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`image_url\` varchar(255) NOT NULL,
        \`order\` int NOT NULL DEFAULT 0,
        \`project_id\` int NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        CONSTRAINT \`FK_project_image_project\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE,
        PRIMARY KEY (\`id\`)
      )
    `);

    // Create technologies table
    await queryRunner.query(`
      CREATE TABLE \`technologies\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`icon_url\` varchar(255) NULL,
        \`color\` varchar(10) NULL,
        \`is_visible\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        CONSTRAINT \`UQ_technology_name\` UNIQUE (\`name\`),
        PRIMARY KEY (\`id\`)
      )
    `);

    // Create projects_technologies join table
    await queryRunner.query(`
      CREATE TABLE \`projects_technologies\` (
        \`project_id\` int NOT NULL,
        \`technology_id\` int NOT NULL,
        CONSTRAINT \`FK_project_technology_project\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_project_technology_technology\` FOREIGN KEY (\`technology_id\`) REFERENCES \`technologies\`(\`id\`) ON DELETE CASCADE,
        PRIMARY KEY (\`project_id\`, \`technology_id\`)
      )
    `);

    // Create contacts table
    await queryRunner.query(`
      CREATE TABLE \`contacts\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`platform_name\` varchar(50) NOT NULL,
        \`url\` varchar(255) NOT NULL,
        \`icon_url\` varchar(255) NOT NULL,
        \`color\` varchar(10) NULL,
        \`order\` int NOT NULL DEFAULT 0,
        \`is_visible\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        CONSTRAINT \`UQ_platform_name\` UNIQUE (\`platform_name\`),
        PRIMARY KEY (\`id\`)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop contacts table
    await queryRunner.query(`DROP TABLE \`contacts\``);

    // Drop projects_technologies join table
    await queryRunner.query(`DROP TABLE \`projects_technologies\``);

    // Drop technologies table
    await queryRunner.query(`DROP TABLE \`technologies\``);

    // Drop project_images table
    await queryRunner.query(`DROP TABLE \`project_images\``);

    // Drop projects table
    await queryRunner.query(`DROP TABLE \`projects\``);

    // Drop users table
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
