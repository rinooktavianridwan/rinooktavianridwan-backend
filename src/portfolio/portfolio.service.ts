import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { Project } from './entities/project.entity';
import { ProjectImage } from './entities/project-image.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class PortfolioService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,

    @InjectRepository(ProjectImage)
    private projectImagesRepository: Repository<ProjectImage>,

    private configService: ConfigService,
  ) {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR');
    if (!uploadDir) {
      throw new Error('UPLOAD_DIR environment variable is not set.');
    }
    this.uploadDir = uploadDir;
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

    const {
      images: updatedImagesDto,
      hapus_gambar,
      ...projectDataToUpdate
    } = updateProjectDto;

    this.projectsRepository.merge(projectToUpdate, projectDataToUpdate);
    await this.projectsRepository.save(projectToUpdate);

    const projectImagesDir = join(
      this.uploadDir,
      'projects',
      String(projectToUpdate.id),
    );
    await fs.ensureDir(projectImagesDir);

    if (hapus_gambar && hapus_gambar.length > 0) {
      const imagesToDelete = await this.projectImagesRepository.find({
        where: { id: In(hapus_gambar), projectId: projectToUpdate.id },
      });
      if (imagesToDelete.length > 0) {
        await this.projectImagesRepository.remove(imagesToDelete);
        for (const img of imagesToDelete) {
          if (img.imageUrl) {
            const filePath = join(
              this.uploadDir,
              img.imageUrl.replace(/^\//, ''),
            );
            if (await fs.pathExists(filePath)) {
              await fs.remove(filePath);
            }
          }
        }
      }
    }

    if (updatedImagesDto) {
      const currentImageMap = new Map<number, ProjectImage>();
      for (const img of projectToUpdate.images || []) {
        currentImageMap.set(img.id, img);
      }

      const newOrUpdated: ProjectImage[] = [];
      for (const imgDto of updatedImagesDto) {
        let image: ProjectImage;
        if (imgDto.id != null && currentImageMap.has(imgDto.id)) {
          image = currentImageMap.get(imgDto.id)!;
          this.projectImagesRepository.merge(image, {
            imageUrl: imgDto.imageUrl ?? image.imageUrl,
            order: imgDto.order ?? image.order,
          });
        } else {
          image = this.projectImagesRepository.create();
          if (imgDto.imageUrl) {
            if (imgDto.imageUrl.startsWith('/temp/')) {
              const tempFileName = imgDto.imageUrl.split('/').pop();
              if (tempFileName) {
                const oldPath = join(this.uploadDir, 'temp', tempFileName);
                const uniqueFileName = generateUniqueFilename(tempFileName);
                const newPath = join(projectImagesDir, uniqueFileName);

                if (await fs.pathExists(oldPath)) {
                  await fs.move(oldPath, newPath, { overwrite: true });
                  image.imageUrl = `/${join(
                    'projects',
                    String(projectToUpdate.id),
                    uniqueFileName,
                  ).replace(/\\/g, '/')}`;
                } else {
                  image.imageUrl = imgDto.imageUrl;
                }
              }
            } else {
              image.imageUrl = imgDto.imageUrl;
            }
          }
          image.order = imgDto.order ?? 0;
        }
        image.project = projectToUpdate;
        image.projectId = projectToUpdate.id;
        newOrUpdated.push(image);
      }
      await this.projectImagesRepository.save(newOrUpdated);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
  }
}

function generateUniqueFilename(originalName: string): string {
  const uniqueId = uuidv4();
  const sanitized = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return `${uniqueId}_${sanitized}`;
}
