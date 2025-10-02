import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './services/contact.service';
import { ContactController } from './controllers/contact.controller';
import { Contact } from '../../infrastructures/database/entities/contact.entity';
import { ContactRepository } from './repositories/contact.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
  exports: [ContactService],
})
export class ContactModule {}
