import { Entity, Column, ManyToMany } from 'typeorm';
import { Project } from './project.entity';
import { Base } from './base.entity';
import { IProject } from '../interfaces/project-entity.interface';
import { ITechnology } from '../interfaces/technology-entity.interface';

@Entity('technologies')
export class Technology extends Base implements ITechnology {
  @Column({ length: 255 })
  name: string;

  @ManyToMany(() => Project, (projects) => projects.technologies)
  projects: IProject[];
}
