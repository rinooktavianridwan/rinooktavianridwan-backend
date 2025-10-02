import { IBase } from './base-entity.interface';

export interface IContact extends IBase {
  platformName: string;
  url: string;
  iconUrl: string;
  color: string;
  order: number;
  isVisible: boolean;
}
