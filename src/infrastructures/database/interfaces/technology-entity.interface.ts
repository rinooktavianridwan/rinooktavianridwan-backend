import { IBase } from './base-entity.interface';
import { IProject } from './project-entity.interface';

export interface ITechnology extends IBase {
  name: string;
  projects: IProject[];
}
