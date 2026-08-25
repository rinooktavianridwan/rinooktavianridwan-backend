import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IContact } from '../../../infrastructures/database/interfaces/contact-entity.interface';
import { ContactRepository } from '../repositories/contact.repository';
import { CreateContactRequest } from '../dtos/requests/create-contact.dto';
import { UpdateContactRequest } from '../dtos/requests/update-contact.dto';
import {
  LocalMulterFile,
  isMulterFile,
  saveUploadedFile,
  deleteUploadedFile,
} from 'src/common/utils/upload.util';
import {
  PaginatedResponse,
  PaginationQuery,
  PaginationUtil,
} from 'src/common/utils/pagination.util';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(
    createContactDto: CreateContactRequest,
    file?: LocalMulterFile,
  ): Promise<void> {
    const data = createContactDto;

    const existingContact = await this.contactRepository.findOneByPlatformName(
      data.platformName,
    );
    if (existingContact) {
      throw new BadRequestException(
        `Contact platform '${data.platformName}' already exists.`,
      );
    }

    let uploadedUrl: string | undefined;
    try {
      if (file && isMulterFile(file)) {
        uploadedUrl = await saveUploadedFile('contact', file);
        createContactDto.iconUrl = uploadedUrl;
      }
      await this.contactRepository.create(createContactDto);
    } catch (err) {
      if (uploadedUrl) await deleteUploadedFile(uploadedUrl);
      throw err;
    }
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
    file?: LocalMulterFile,
  ): Promise<void> {
    const contactToUpdate = await this.contactRepository.findOneById(id);
    if (!contactToUpdate) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }

    const data = updateContactDto;

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

    let newIconUrl: string | undefined;
    const oldIconUrl = contactToUpdate.iconUrl;
    if (file && isMulterFile(file)) {
      newIconUrl = await saveUploadedFile('contact', file);
      updateContactDto.iconUrl = newIconUrl;
    }

    try {
      await this.contactRepository.update(contactToUpdate, updateContactDto);
      if (newIconUrl && oldIconUrl) await deleteUploadedFile(oldIconUrl);
    } catch (err) {
      if (newIconUrl) await deleteUploadedFile(newIconUrl);
      throw err;
    }
  }

  async findAllVisible(): Promise<IContact[]> {
    return await this.contactRepository.findAllVisible();
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.contactRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }
  }
}
