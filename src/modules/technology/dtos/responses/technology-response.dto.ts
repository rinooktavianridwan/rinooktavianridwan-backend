import { ITechnology } from '../../../../infrastructures/database/interfaces/technology-entity.interface';

export class TechnologyResponseDto {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  isVisible: boolean;

  static fromEntity(technology: ITechnology): TechnologyResponseDto {
    const dto = new TechnologyResponseDto();
    dto.id = technology.id;
    dto.name = technology.name;
    dto.description = technology.description;
    dto.iconUrl = technology.iconUrl;
    dto.color = technology.color;
    dto.isVisible = technology.isVisible;
    return dto;
  }
}
