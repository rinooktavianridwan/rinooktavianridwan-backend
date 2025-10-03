import { IBase } from './base-entity.interface';
import { IProjectImage } from './project-image-entity.interface';
import { ITechnology } from './technology-entity.interface';
import { IUser } from './user-entity.interface';

export interface IProject extends IBase {
  title: string;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  documentationUrl?: string;
  isVisible: boolean;
  userId?: number;
  user?: IUser;
  images?: IProjectImage[];
  technologies?: ITechnology[];
}
