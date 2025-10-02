import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1754552622463 implements MigrationInterface {
  name = 'InitDatabase1754552622463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" int NOT NULL AUTO_INCREMENT,
        "username" varchar(50) NOT NULL,
        "password" varchar(255) NOT NULL,
        "email" varchar(100) NULL,
        "bio" text NULL,
        "profilePictureUrl" varchar(255) NULL,
        "createdAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "updatedAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        "deletedAt" datetime(6) NULL,
        CONSTRAINT "UQ_username" UNIQUE ("username"),
        CONSTRAINT "UQ_email" UNIQUE ("email"),
        PRIMARY KEY ("id")
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" int NOT NULL AUTO_INCREMENT,
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "websiteUrl" varchar(255) NULL,
        "githubUrl" varchar(255) NULL,
        "documentationUrl" varchar(255) NULL,
        "isVisible" tinyint NOT NULL DEFAULT 1,
        "createdAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "updatedAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        "deletedAt" datetime(6) NULL,
        "userId" int NULL,
        CONSTRAINT "FK_project_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL,
        PRIMARY KEY ("id")
      )
    `);

    // Create project_images table
    await queryRunner.query(`
      CREATE TABLE "project_images" (
        "id" int NOT NULL AUTO_INCREMENT,
        "imageUrl" varchar(255) NOT NULL,
        "order" int NOT NULL DEFAULT 0,
        "projectId" int NOT NULL,
        "createdAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "updatedAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        "deletedAt" datetime(6) NULL,
        CONSTRAINT "FK_project_image_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE,
        PRIMARY KEY ("id")
      )
    `);

    // Create technologies table
    await queryRunner.query(`
      CREATE TABLE "technologies" (
        "id" int NOT NULL AUTO_INCREMENT,
        "name" varchar(255) NOT NULL,
        "createdAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "updatedAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        "deletedAt" datetime(6) NULL,
        PRIMARY KEY ("id")
      )
    `);

    // Create projects_technologies join table
    await queryRunner.query(`
      CREATE TABLE "projects_technologies" (
        "projectId" int NOT NULL,
        "technologyId" int NOT NULL,
        CONSTRAINT "FK_project_technology_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_project_technology_technology" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE,
        PRIMARY KEY ("projectId", "technologyId")
      )
    `);

    // Create contacts table
    await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" int NOT NULL AUTO_INCREMENT,
        "platformName" varchar(50) NOT NULL,
        "url" varchar(255) NOT NULL,
        "iconUrl" varchar(255) NOT NULL,
        "color" varchar(10) NULL,
        "order" int NOT NULL DEFAULT 0,
        "isVisible" tinyint NOT NULL DEFAULT 1,
        "createdAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "updatedAt" datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        "deletedAt" datetime(6) NULL,
        CONSTRAINT "UQ_platformName" UNIQUE ("platformName"),
        PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop contacts table
    await queryRunner.query(`DROP TABLE "contacts"`);

    // Drop projects_technologies join table
    await queryRunner.query(`DROP TABLE "projects_technologies"`);

    // Drop technologies table
    await queryRunner.query(`DROP TABLE "technologies"`);

    // Drop project_images table
    await queryRunner.query(`DROP TABLE "project_images"`);

    // Drop projects table
    await queryRunner.query(`DROP TABLE "projects"`);

    // Drop users table
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
