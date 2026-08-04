import { Injectable, NotFoundException } from '@nestjs/common';
import { IProject } from '../../../infrastructures/database/interfaces/project-entity.interface';
import { ProjectRepository } from '../repositories/project.repository';
import {
  CreateProjectRequest,
  CreateProjectImageDto,
} from '../dtos/requests/create-project.dto';
import {
  UpdateProjectRequest,
  UpdateProjectImageDto,
} from '../dtos/requests/update-project.dto';
import {
  PaginatedResponse,
  PaginationQuery,
  PaginationUtil,
} from '../../../common/utils/pagination.util';
import {
  saveUploadedFile,
  deleteUploadedFile,
  isMulterFile,
  LocalMulterFile,
} from 'src/common/utils/upload.util';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(
    createProjectDto: CreateProjectRequest,
    files?: LocalMulterFile[],
  ): Promise<IProject> {
    // upload files and map to images DTOs if files provided
    let uploadedImages: CreateProjectImageDto[] = [];
    if (files && files.length > 0) {
      uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!isMulterFile(f)) continue;
        const url = await saveUploadedFile('project', f);
        uploadedImages.push({
          imageUrl: url,
          order: i,
        });
      }
      // merge with any client-sent images (imageUrl entries)
      createProjectDto.images = [
        ...(createProjectDto.images || []),
        ...uploadedImages,
      ];
    }

    // Validate technology IDs exist would be done in repository
    try {
      const project = await this.projectRepository.create(createProjectDto);
      return project;
    } catch (err) {
      // cleanup files we uploaded to avoid orphans
      if (uploadedImages && uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((img) => deleteUploadedFile(img.imageUrl)),
        );
      }
      throw err;
    }
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
    files?: LocalMulterFile[],
  ): Promise<IProject> {
    const projectToUpdate = await this.projectRepository.findOneById(id);
    if (!projectToUpdate) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    // If deleteImageIds provided, prepare list of URLs to delete AFTER successful repo update
    const data = updateProjectDto;
    const urlsToDelete: string[] = [];
    if (data.deleteImageIds && projectToUpdate.images) {
      const idsToDelete = data.deleteImageIds;
      for (const img of projectToUpdate.images) {
        if (idsToDelete.includes(img.id)) {
          urlsToDelete.push(img.imageUrl);
        }
      }
    }

    // upload new files (keep track to cleanup on failure)
    let uploadedImages: UpdateProjectImageDto[] = [];
    if (files && files.length > 0) {
      const tmp: UpdateProjectImageDto[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!isMulterFile(f)) continue;
        const url = await saveUploadedFile('project', f);
        tmp.push({ imageUrl: url });
      }
      uploadedImages = tmp;
    }

    // Determine order and assign to uploaded images
    const existingOrders =
      projectToUpdate.images?.map((img) => img.order) ?? [];
    const providedImages = Array.isArray(data.images) ? data.images : [];
    const providedOrders = providedImages
      .map((i) => (i.order !== undefined ? i.order : -1))
      .filter((o) => o >= 0);

    const allOrders = [...existingOrders, ...providedOrders];
    const maxOrder = allOrders.length > 0 ? Math.max(...allOrders) : -1;

    if (uploadedImages.length > 0) {
      for (let i = 0; i < uploadedImages.length; i++) {
        uploadedImages[i].order = maxOrder + 1 + i;
      }
    }

    // Merge provided images and uploaded images into DTO
    const existingUpdateImages = Array.isArray(data.images) ? data.images : [];
    updateProjectDto.images = [...existingUpdateImages, ...uploadedImages];

    try {
      const updatedProject = await this.projectRepository.update(
        projectToUpdate,
        updateProjectDto,
      );

      // after successful DB update, delete physical files for removed images
      if (urlsToDelete.length > 0) {
        await Promise.all(urlsToDelete.map((u) => deleteUploadedFile(u)));
      }

      return updatedProject;
    } catch (err) {
      // cleanup newly uploaded files on failure
      if (uploadedImages && uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((img) => deleteUploadedFile(img.imageUrl)),
        );
      }
      throw err;
    }
  }

  async findAllVisible(): Promise<IProject[]> {
    return await this.projectRepository.findAllVisible();
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.projectRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
  }
}
