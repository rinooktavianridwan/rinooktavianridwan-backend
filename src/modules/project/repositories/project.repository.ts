import { Injectable } from '@nestjs/common';
import { Repository, DataSource, In } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Project } from '../../../infrastructures/database/entities/project.entity';
import { ProjectImage } from '../../../infrastructures/database/entities/project-image.entity';
import { Technology } from '../../../infrastructures/database/entities/technology.entity';
import { IProject } from '../../../infrastructures/database/interfaces/project-entity.interface';
import { IProjectImage } from '../../../infrastructures/database/interfaces/project-image-entity.interface';
import { ITechnology } from '../../../infrastructures/database/interfaces/technology-entity.interface';
import { CreateProjectRequest } from '../dtos/requests/create-project.dto';
import { UpdateProjectRequest } from '../dtos/requests/update-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<IProject>,
    @InjectRepository(ProjectImage)
    private readonly projectImageRepository: Repository<IProjectImage>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<ITechnology>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createProjectDto: CreateProjectRequest): Promise<IProject> {
    return await this.dataSource.transaction(async (manager) => {
      const projectRepo = manager.getRepository(Project);
      const imageRepo = manager.getRepository(ProjectImage);
      const techRepo = manager.getRepository(Technology);

      // Create project
      const newProject = projectRepo.create({
        title: createProjectDto.title,
        description: createProjectDto.description,
        websiteUrl: createProjectDto.websiteUrl,
        githubUrl: createProjectDto.githubUrl,
        documentationUrl: createProjectDto.documentationUrl,
        isVisible: createProjectDto.isVisible,
        userId: createProjectDto.userId,
      });

      const savedProject = await projectRepo.save(newProject);

      // Handle technologies
      if (
        createProjectDto.technologyIds &&
        createProjectDto.technologyIds.length > 0
      ) {
        const technologies = await techRepo.findBy({
          id: In(createProjectDto.technologyIds),
        });
        savedProject.technologies = technologies;
        await projectRepo.save(savedProject);
      }

      // Handle images
      if (createProjectDto.images && createProjectDto.images.length > 0) {
        const projectImages = createProjectDto.images.map((imgDto) =>
          imageRepo.create({
            imageUrl: imgDto.imageUrl,
            order: imgDto.order || 0,
            projectId: savedProject.id,
          }),
        );
        const savedImages = await imageRepo.save(projectImages);
        savedProject.images = savedImages;
      }

      return savedProject;
    });
  }

  async findAllPaginated(
    skip: number,
    take: number,
  ): Promise<{ data: IProject[]; total: number }> {
    const [data, total] = await this.projectRepository.findAndCount({
      relations: ['user', 'images', 'technologies'],
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { data, total };
  }

  async findOneById(id: number): Promise<IProject | null> {
    return await this.projectRepository.findOne({
      where: { id },
      relations: ['user', 'images', 'technologies'],
    });
  }

  async update(
    project: IProject,
    updateProjectDto: UpdateProjectRequest,
  ): Promise<IProject> {
    return await this.dataSource.transaction(async (manager) => {
      const projectRepo = manager.getRepository(Project);
      const imageRepo = manager.getRepository(ProjectImage);
      const techRepo = manager.getRepository(Technology);

      // Update project basic fields
      if (updateProjectDto.title) project.title = updateProjectDto.title;
      if (updateProjectDto.description)
        project.description = updateProjectDto.description;
      if (updateProjectDto.websiteUrl !== undefined)
        project.websiteUrl = updateProjectDto.websiteUrl;
      if (updateProjectDto.githubUrl !== undefined)
        project.githubUrl = updateProjectDto.githubUrl;
      if (updateProjectDto.documentationUrl !== undefined)
        project.documentationUrl = updateProjectDto.documentationUrl;
      if (updateProjectDto.isVisible !== undefined)
        project.isVisible = updateProjectDto.isVisible;
      if (updateProjectDto.userId !== undefined)
        project.userId = updateProjectDto.userId;

      const updatedProject = await projectRepo.save(project as Project);

      // Handle technologies update
      if (updateProjectDto.technologyIds !== undefined) {
        if (updateProjectDto.technologyIds.length > 0) {
          const technologies = await techRepo.findBy({
            id: In(updateProjectDto.technologyIds),
          });
          updatedProject.technologies = technologies;
        } else {
          updatedProject.technologies = [];
        }
        await projectRepo.save(updatedProject);
      }

      // Handle image deletion
      if (
        updateProjectDto.deleteImageIds &&
        updateProjectDto.deleteImageIds.length > 0
      ) {
        await imageRepo.delete({
          id: In(updateProjectDto.deleteImageIds),
          projectId: project.id,
        });
      }

      // Handle image updates and creation
      if (updateProjectDto.images) {
        for (const imgDto of updateProjectDto.images) {
          if (imgDto.id) {
            // Update existing image
            const existingImage = await imageRepo.findOneBy({
              id: imgDto.id,
              projectId: project.id,
            });
            if (existingImage) {
              if (imgDto.imageUrl) existingImage.imageUrl = imgDto.imageUrl;
              if (imgDto.order !== undefined)
                existingImage.order = imgDto.order;
              await imageRepo.save(existingImage);
            }
          } else if (imgDto.imageUrl) {
            // Create new image
            const newImage = imageRepo.create({
              imageUrl: imgDto.imageUrl,
              order: imgDto.order || 0,
              projectId: project.id,
            });
            await imageRepo.save(newImage);
          }
        }
      }

      // Return updated project with relations
      return (await projectRepo.findOne({
        where: { id: updatedProject.id },
        relations: ['user', 'images', 'technologies'],
      })) as IProject;
    });
  }

  async deleteById(id: number): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const projectRepo = manager.getRepository(Project);
      const result = await projectRepo.delete(id);
      return (
        result.affected !== undefined &&
        result.affected !== null &&
        result.affected > 0
      );
    });
  }
}
