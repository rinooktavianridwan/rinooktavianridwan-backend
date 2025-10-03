import { IBase } from './base-entity.interface';

export interface ITechnology extends IBase {
  name: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  isVisible: boolean;
}
