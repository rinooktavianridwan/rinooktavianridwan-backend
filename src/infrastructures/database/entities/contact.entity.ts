import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IContact } from '../interfaces/contact-entity.interface';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity('contacts')
export class Contact extends Base implements IContact {
  @Column({ unique: true, length: 50 })
  platformName!: string;

  @Column({ length: 255 })
  url!: string;

  @Column({ length: 255 })
  iconUrl!: string;

  @Column({ nullable: true, length: 10 })
  color!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ default: true })
  isVisible!: boolean;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
