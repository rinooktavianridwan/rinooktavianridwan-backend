import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinTable,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { ProjectImage } from './project-image.entity';
import { IProjectImage } from '../interfaces/project-image-entity.interface';
import { User } from './user.entity';
import { IUser } from '../interfaces/user-entity.interface';
import { Technology } from './technology.entity';
import { ITechnology } from '../interfaces/technology-entity.interface';
import { IProject } from '../interfaces/project-entity.interface';
import { Base } from './base.entity';

@Entity('projects')
export class Project extends Base implements IProject {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, length: 255 })
  websiteUrl?: string;

  @Column({ nullable: true, length: 255 })
  githubUrl?: string;

  @Column({ nullable: true, length: 255 })
  documentationUrl?: string;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: IUser;

  @OneToMany(() => ProjectImage, (projectImage) => projectImage.project, {
    cascade: true,
    eager: false,
  })
  images?: IProjectImage[];

  @ManyToMany(() => Technology, {
    cascade: true,
    eager: false,
  })
  @JoinTable({
    name: 'projects_technologies',
    joinColumn: { name: 'projectId' },
    inverseJoinColumn: { name: 'technologyId' },
  })
  technologies?: ITechnology[];
}
