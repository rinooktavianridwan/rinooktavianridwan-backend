import { Project } from '../entities/project.entity';
import { ProjectImageResponseDto } from './project-image-response.dto';

export class ProjectResponseDto {
  id: number;
  title: string;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  documentationUrl?: string;
  technologies?: string[];
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: ProjectImageResponseDto[];

  static fromEntity(project: Project): ProjectResponseDto {
    const dto = new ProjectResponseDto();
    dto.id = project.id;
    dto.title = project.title;
    dto.description = project.description;
    dto.websiteUrl = project.websiteUrl;
    dto.githubUrl = project.githubUrl;
    dto.documentationUrl = project.documentationUrl;
    dto.technologies = project.technologies;
    dto.isVisible = project.isVisible;
    dto.createdAt = project.createdAt;
    dto.updatedAt = project.updatedAt;

    if (project.images) {
      dto.images = project.images.map((image) =>
        ProjectImageResponseDto.fromEntity(image),
      );
    }
    return dto;
  }
}
