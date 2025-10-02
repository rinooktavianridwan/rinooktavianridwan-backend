import { IContact } from '../../../infrastructures/database/interfaces/contact-entity.interface';

export class ContactResponseDto {
  id: number;
  platformName: string;
  url: string;
  iconUrl: string;
  color?: string;
  order: number;
  isVisible: boolean;

  static fromEntity(contact: IContact): ContactResponseDto {
    const dto = new ContactResponseDto();
    dto.id = contact.id;
    dto.platformName = contact.platformName;
    dto.url = contact.url;
    dto.iconUrl = contact.iconUrl;
    dto.color = contact.color;
    dto.order = contact.order;
    dto.isVisible = contact.isVisible;
    return dto;
  }
}
