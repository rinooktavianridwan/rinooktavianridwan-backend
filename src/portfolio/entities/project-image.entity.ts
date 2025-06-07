import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_images')
export class ProjectImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Project, (project) => project.images, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  projectId: number;
}
