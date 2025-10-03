import { Injectable, NotFoundException } from '@nestjs/common';
import { IProject } from '../../../infrastructures/database/interfaces/project-entity.interface';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectRequest } from '../dtos/requests/create-project.dto';
import { UpdateProjectRequest } from '../dtos/requests/update-project.dto';
import {
  PaginatedResponse,
  PaginationQuery,
  PaginationUtil,
} from '../../../common/utils/pagination.util';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(createProjectDto: CreateProjectRequest): Promise<IProject> {
    // Validate technology IDs exist would be done in repository
    const project = await this.projectRepository.create(createProjectDto);
    return project;
  }

  async findAllPaginated(
    query: PaginationQuery,
  ): Promise<PaginatedResponse<IProject>> {
    const { page, per_page, skip, take } =
      PaginationUtil.validatePaginationQuery(query);

    const { data, total } = await this.projectRepository.findAllPaginated(
      skip,
      take,
    );

    return PaginationUtil.createPaginatedResponse(data, page, per_page, total);
  }

  async findOne(id: number): Promise<IProject> {
    const project = await this.projectRepository.findOneById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectRequest,
  ): Promise<IProject> {
    const projectToUpdate = await this.projectRepository.findOneById(id);
    if (!projectToUpdate) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    const updatedProject = await this.projectRepository.update(
      projectToUpdate,
      updateProjectDto,
    );
    return updatedProject;
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.projectRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
  }
}
