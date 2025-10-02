import { IBase } from './base-entity.interface';
import { IProject } from './project-entity.interface';

export interface IProjectImage extends IBase {
  imageUrl: string;
  order: number;
  projectId: number;
  project: IProject;
}
