import { Entity, Column, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user-entity.interface';
import { Project } from './project.entity';
import { Base } from './base.entity';
import { IProject } from '../interfaces/project-entity.interface';

@Entity('users')
export class User extends Base implements IUser {
  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ unique: true, nullable: true, length: 100 })
  email?: string;

  @Column({ nullable: true, length: 255 })
  name?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true, length: 255 })
  profilePictureUrl?: string;

  @OneToMany(() => Project, (project) => project.user)
  projects?: IProject[];

  async hashPassword(password: string): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
