import { IBase } from './base-entity.interface';
import { IUser } from './user-entity.interface';

export interface IContact extends IBase {
  platformName: string;
  url: string;
  iconUrl: string;
  color: string;
  order: number;
  isVisible: boolean;
  userId: number;
  user?: IUser;
}
