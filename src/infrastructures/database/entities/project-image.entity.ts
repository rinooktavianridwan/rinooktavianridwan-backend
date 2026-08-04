import { Entity, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { IProject } from '../interfaces/project-entity.interface';
import { IProjectImage } from '../interfaces/project-image-entity.interface';
import { Base } from './base.entity';

@Entity('project_images')
export class ProjectImage extends Base implements IProjectImage {
  @Column({ length: 255 })
  imageUrl!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @ManyToOne(() => Project, (project) => project.images, {
    onDelete: 'CASCADE',
  })
  project!: IProject;

  @Column()
  projectId!: number;
}
