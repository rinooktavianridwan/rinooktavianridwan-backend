import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const existingContact = await this.contactsRepository.findOneBy({
      platformName: createContactDto.platformName,
    });
    if (existingContact) {
      throw new BadRequestException(
        `Contact platform '${createContactDto.platformName}' already exists.`,
      );
    }

    const newContact = this.contactsRepository.create(createContactDto);
    return this.contactsRepository.save(newContact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactsRepository.find({
      order: { order: 'ASC', platformName: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactsRepository.findOneBy({ id });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }
    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contactToUpdate = await this.contactsRepository.findOneBy({ id });
    if (!contactToUpdate) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }

    if (
      updateContactDto.platformName &&
      updateContactDto.platformName !== contactToUpdate.platformName
    ) {
      const existingContact = await this.contactsRepository.findOneBy({
        platformName: updateContactDto.platformName,
      });
      if (existingContact && existingContact.id !== id) {
        throw new BadRequestException(
          `Contact platform '${updateContactDto.platformName}' already exists.`,
        );
      }
    }

    this.contactsRepository.merge(contactToUpdate, updateContactDto);
    return this.contactsRepository.save(contactToUpdate);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.contactsRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }
  }
}
