import { IProjectImage } from '../../../../infrastructures/database/interfaces/project-image-entity.interface';

export class ProjectImageResponseDto {
  id: number;
  imageUrl: string;
  order: number;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(image: IProjectImage): ProjectImageResponseDto {
    const dto = new ProjectImageResponseDto();
    dto.id = image.id;
    dto.imageUrl = image.imageUrl;
    dto.order = image.order;
    dto.projectId = image.projectId;
    dto.createdAt = image.createdAt;
    dto.updatedAt = image.updatedAt;
    return dto;
  }
}
