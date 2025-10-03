import { IProject } from '../../../../infrastructures/database/interfaces/project-entity.interface';
import { ProjectImageResponseDto } from './project-image-response.dto';
import { TechnologyResponseDto } from '../../../technology/dtos/responses/technology-response.dto';
import { UserResponseDto } from '../../../user/dtos/responses/user-response.dto';

export class ProjectResponseDto {
  id: number;
  title: string;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  documentationUrl?: string;
  isVisible: boolean;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
  user?: UserResponseDto;
  images?: ProjectImageResponseDto[];
  technologies?: TechnologyResponseDto[];

  static fromEntity(project: IProject): ProjectResponseDto {
    const dto = new ProjectResponseDto();
    dto.id = project.id;
    dto.title = project.title;
    dto.description = project.description;
    dto.websiteUrl = project.websiteUrl;
    dto.githubUrl = project.githubUrl;
    dto.documentationUrl = project.documentationUrl;
    dto.isVisible = project.isVisible;
    dto.userId = project.userId;
    dto.createdAt = project.createdAt;
    dto.updatedAt = project.updatedAt;

    if (project.user) {
      dto.user = UserResponseDto.fromEntity(project.user);
    }

    if (project.images) {
      dto.images = project.images.map((image) =>
        ProjectImageResponseDto.fromEntity(image),
      );
    }

    if (project.technologies) {
      dto.technologies = project.technologies.map((tech) =>
        TechnologyResponseDto.fromEntity(tech),
      );
    }

    return dto;
  }
}
