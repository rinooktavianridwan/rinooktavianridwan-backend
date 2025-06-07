// src/portfolio/portfolio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectImage])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
