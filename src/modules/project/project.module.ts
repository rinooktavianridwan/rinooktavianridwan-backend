import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';
import { Project } from '../../infrastructures/database/entities/project.entity';
import { ProjectImage } from '../../infrastructures/database/entities/project-image.entity';
import { Technology } from '../../infrastructures/database/entities/technology.entity';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectImage, Technology])],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
