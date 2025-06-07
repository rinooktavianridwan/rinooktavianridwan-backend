import { ProjectImage } from '../entities/project-image.entity';

export class ProjectImageResponseDto {
  id: number;
  imageUrl: string;
  order: number;
  projectId: number;

  static fromEntity(image: ProjectImage): ProjectImageResponseDto {
    const dto = new ProjectImageResponseDto();
    dto.id = image.id;
    dto.imageUrl = image.imageUrl;
    dto.order = image.order;
    dto.projectId = image.projectId;
    return dto;
  }
}
