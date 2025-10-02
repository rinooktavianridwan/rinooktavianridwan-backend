import { IBase } from './base-entity.interface';
import { IProject } from './project-entity.interface';

export interface IUser extends IBase {
  username: string;
  password: string;
  email: string;
  bio: string;
  profilePictureUrl: string;
  projects?: IProject[];
}
