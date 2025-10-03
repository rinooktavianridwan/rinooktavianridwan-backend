import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyService } from './services/technology.service';
import { TechnologyController } from './controllers/technology.controller';
import { Technology } from '../../infrastructures/database/entities/technology.entity';
import { TechnologyRepository } from './repositories/technology.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  controllers: [TechnologyController],
  providers: [TechnologyService, TechnologyRepository],
  exports: [TechnologyService],
})
export class TechnologyModule {}
