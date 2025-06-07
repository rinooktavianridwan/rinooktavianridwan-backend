import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs-extra';
import { join } from 'path';

@Injectable()
export class PortfolioService {
  private readonly uploadDir: string;
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectImage)
    private projectImagesRepository: Repository<ProjectImage>,
    private configService: ConfigService, // Inject ConfigService
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR');
    if (!this.uploadDir) {
      throw new Error('UPLOAD_DIR environment variable is not set.');
    }
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { images, ...projectData } = createProjectDto;

    const newProject = this.projectsRepository.create(projectData);
    const savedProject = await this.projectsRepository.save(newProject);

    if (images && images.length > 0) {
      const projectImages = images.map((imgDto) =>
        this.projectImagesRepository.create({
          ...imgDto,
          project: savedProject,
          projectId: savedProject.id,
        }),
      );
      await this.projectImagesRepository.save(projectImages);
      savedProject.images = projectImages;
    }

    return savedProject;
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const projectToUpdate = await this.projectsRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!projectToUpdate) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    const { images: updatedImagesDto, ...projectDataToUpdate } =
      updateProjectDto;

    this.projectsRepository.merge(projectToUpdate, projectDataToUpdate);
    const savedProject = await this.projectsRepository.save(projectToUpdate); // Ubah const jadi let

    if (updatedImagesDto !== undefined) {
      const projectImagesDir = join(
        UPLOAD_DIR,
        'projects',
        savedProject.id.toString(),
      );
      await fs.ensureDir(projectImagesDir);

      const currentImageMap = new Map(
        projectToUpdate.images.map((img) => [img.id, img]),
      );
      const newOrUpdatedImages: ProjectImage[] = [];
      const imageIdsToKeep = new Set<number>();

      for (const imgDto of updatedImagesDto) {
        let image: ProjectImage;
        if (imgDto.id && currentImageMap.has(imgDto.id)) {
          image = currentImageMap.get(imgDto.id);
          this.projectImagesRepository.merge(image, {
            imageUrl: imgDto.imageUrl,
            order: imgDto.order,
          });
          imageIdsToKeep.add(image.id);
        } else {
          image = this.projectImagesRepository.create(imgDto);

          if (imgDto.imageUrl && imgDto.imageUrl.startsWith('/temp/')) {
            const tempFileName = imgDto.imageUrl.split('/').pop();
            const oldPath = join(UPLOAD_DIR, 'temp', tempFileName);
            const newPath = join(projectImagesDir, tempFileName);

            if (await fs.pathExists(oldPath)) {
              await fs.move(oldPath, newPath, { overwrite: true });
              const relativeImagePath = join(
                'projects',
                savedProject.id.toString(),
                tempFileName,
              );
              image.imageUrl = `/${relativeImagePath.replace(/\\/g, '/')}`;
            } else {
              image.imageUrl = imgDto.imageUrl;
            }
          } else {
            image.imageUrl = imgDto.imageUrl;
          }
        }
        image.project = savedProject;
        image.projectId = savedProject.id;
        newOrUpdatedImages.push(image);
      }

      const imagesToRemove = projectToUpdate.images.filter(
        (img) => !imageIdsToKeep.has(img.id),
      );
      if (imagesToRemove.length > 0) {
        await this.projectImagesRepository.remove(imagesToRemove);
        // Opsional: Hapus file fisik dari disk
        for (const img of imagesToRemove) {
          const filePath = join(UPLOAD_DIR, img.imageUrl.replace(/^\//, ''));
          if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
          }
        }
      }

      await this.projectImagesRepository.save(newOrUpdatedImages);
      const updatedAndRefreshedProject = await this.projectsRepository.findOne({
        where: { id },
        relations: ['images'],
      });
      if (!updatedAndRefreshedProject) {
        throw new NotFoundException(
          `Project with ID ${id} not found after update refresh.`,
        );
      }
      return updatedAndRefreshedProject;
    }

    return savedProject;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.projectsRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
  }
}
