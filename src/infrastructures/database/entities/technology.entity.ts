import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';
import { ITechnology } from '../interfaces/technology-entity.interface';

@Entity('technologies')
export class Technology extends Base implements ITechnology {
  @Column({ length: 255, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 255, nullable: true })
  iconUrl?: string;

  @Column({ length: 10, nullable: true })
  color?: string;

  @Column({ default: true })
  isVisible!: boolean;
}
