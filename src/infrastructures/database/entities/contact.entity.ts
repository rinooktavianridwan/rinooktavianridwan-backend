import { Entity, Column } from 'typeorm';
import { IContact } from '../interfaces/contact-entity.interface';
import { Base } from './base.entity';

@Entity('contacts')
export class Contact extends Base implements IContact {
  @Column({ unique: true, length: 50 })
  platformName: string;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 255 })
  iconUrl: string;

  @Column({ nullable: true, length: 10 })
  color: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isVisible: boolean;
}
