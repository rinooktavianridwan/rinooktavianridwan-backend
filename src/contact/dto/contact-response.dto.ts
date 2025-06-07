import { Contact } from '../entities/contact.entity';

export class ContactResponseDto {
  id: number;
  platformName: string;
  url: string;
  iconUrl: string;
  color?: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(contact: Contact): ContactResponseDto {
    const dto = new ContactResponseDto();
    dto.id = contact.id;
    dto.platformName = contact.platformName;
    dto.url = contact.url;
    dto.iconUrl = contact.iconUrl;
    dto.color = contact.color;
    dto.order = contact.order;
    dto.isVisible = contact.isVisible;
    dto.createdAt = contact.createdAt;
    dto.updatedAt = contact.updatedAt;
    return dto;
  }
}
