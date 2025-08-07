// src/portfolio/portfolio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './services/portfolio.service';
import { PortfolioController } from './controllers/portfolio.controller';
import { Project } from '../../infrastructures/database/entities/project.entity';
import { ProjectImage } from '../../infrastructures/database/entities/project-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectImage])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule { }
