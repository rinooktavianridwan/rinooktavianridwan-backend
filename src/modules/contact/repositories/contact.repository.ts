import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../../../infrastructures/database/entities/contact.entity';
import { IContact } from '../../../infrastructures/database/interfaces/contact-entity.interface';
import { CreateContactRequest } from '../dtos/requests/create-contact.dto';
import { UpdateContactRequest } from '../dtos/requests/update-contact.dto';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<IContact>,
  ) {}

  async create(createContactDto: CreateContactRequest): Promise<void> {
    const newContact = this.contactsRepository.create(createContactDto);
    await this.contactsRepository.save(newContact);
  }

  async findAll(): Promise<IContact[]> {
    return await this.contactsRepository.find({
      order: { order: 'ASC', platformName: 'ASC' },
    });
  }

  async findOneById(id: number): Promise<IContact | null> {
    return await this.contactsRepository.findOneBy({ id });
  }

  async findOneByPlatformName(platformName: string): Promise<IContact | null> {
    return await this.contactsRepository.findOneBy({ platformName });
  }

  async update(
    contact: IContact,
    updateContactDto: UpdateContactRequest,
  ): Promise<void> {
    this.contactsRepository.merge(contact as Contact, updateContactDto);
    await this.contactsRepository.save(contact as Contact);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.contactsRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
