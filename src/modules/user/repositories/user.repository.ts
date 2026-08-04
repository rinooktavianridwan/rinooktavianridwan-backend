import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../infrastructures/database/entities/user.entity';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';
import { CreateUserRequest } from '../dtos/requests/create-user.dto';
import { UpdateUserRequest } from '../dtos/requests/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<IUser>,
  ) {}

  async create(createUserDto: CreateUserRequest): Promise<void> {
    const newUser = this.userRepository.create(createUserDto);
    // Hash password before saving
    await (newUser as User).hashPassword(createUserDto.password);
    await this.userRepository.save(newUser);
  }

  async findAllPaginated(
    skip: number,
    take: number,
  ): Promise<{ data: IUser[]; total: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { data, total };
  }

  async findOneById(id: number): Promise<IUser | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<IUser | null> {
    return await this.userRepository.findOne({
      where: { username },
      select: [
        'id',
        'username',
        'password',
        'email',
        'name',
        'bio',
        'profilePictureUrl',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(user: IUser, updateUserDto: UpdateUserRequest): Promise<void> {
    // Handle password hashing if provided
    if (updateUserDto.password) {
      await (user as User).hashPassword(updateUserDto.password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...updateData } = updateUserDto;
      this.userRepository.merge(user, updateData);
    } else {
      this.userRepository.merge(user, updateUserDto);
    }

    await this.userRepository.save(user as User);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
