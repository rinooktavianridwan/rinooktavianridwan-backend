import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectImage } from './project-image.entity';

@Entity('projects') // Nama tabel di database
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, length: 255 })
  websiteUrl: string;

  @Column({ nullable: true, length: 255 })
  githubUrl: string;

  @Column({ nullable: true, length: 255 })
  documentationUrl: string;

  @Column({ type: 'json', nullable: true })
  technologies: string[];

  @Column({ default: true })
  isVisible: boolean;

  @OneToMany(() => ProjectImage, (projectImage) => projectImage.project, {
    cascade: true,
    eager: false,
  })
  images: ProjectImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
