import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { ContactService } from './services/contact.service';
import { ContactController } from './controllers/contact.controller';
import { Contact } from '../../infrastructures/database/entities/contact.entity'; // Import Contact Entity

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule { }
