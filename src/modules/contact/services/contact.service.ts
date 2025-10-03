import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IContact } from '../../../infrastructures/database/interfaces/contact-entity.interface';
import { ContactRepository } from '../repositories/contact.repository';
import {
  CreateContactRequest,
  CreateContactDto,
} from '../dtos/requests/create-contact.dto';
import {
  UpdateContactRequest,
  UpdateContactDto,
} from '../dtos/requests/update-contact.dto';
import {
  PaginatedResponse,
  PaginationQuery,
  PaginationUtil,
} from 'src/common/utils/pagination.util';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(createContactDto: CreateContactRequest): Promise<void> {
    const data = createContactDto as unknown as CreateContactDto;

    const existingContact = await this.contactRepository.findOneByPlatformName(
      data.platformName,
    );
    if (existingContact) {
      throw new BadRequestException(
        `Contact platform '${data.platformName}' already exists.`,
      );
    }

    await this.contactRepository.create(createContactDto);
  }

  async findAllPaginated(
    query: PaginationQuery,
  ): Promise<PaginatedResponse<IContact>> {
    const { page, per_page, skip, take } =
      PaginationUtil.validatePaginationQuery(query);

    const { data, total } = await this.contactRepository.findAllPaginated(
      skip,
      take,
    );

    return PaginationUtil.createPaginatedResponse(data, page, per_page, total);
  }

  async findOne(id: number): Promise<IContact> {
    const contact = await this.contactRepository.findOneById(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }
    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactRequest,
  ): Promise<void> {
    const contactToUpdate = await this.contactRepository.findOneById(id);
    if (!contactToUpdate) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }

    const data = updateContactDto as unknown as UpdateContactDto;

    if (
      data.platformName &&
      data.platformName !== contactToUpdate.platformName
    ) {
      const existingContact =
        await this.contactRepository.findOneByPlatformName(data.platformName);
      if (existingContact && existingContact.id !== id) {
        throw new BadRequestException(
          `Contact platform '${data.platformName}' already exists.`,
        );
      }
    }

    await this.contactRepository.update(contactToUpdate, updateContactDto);
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.contactRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }
  }
}
