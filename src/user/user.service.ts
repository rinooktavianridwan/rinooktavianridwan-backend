import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByUsername = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });
    if (existingUserByUsername) {
      throw new BadRequestException('Username already exists');
    }

    if (createUserDto.email) {
      const existingUserByEmail = await this.usersRepository.findOneBy({
        email: createUserDto.email,
      });
      if (existingUserByEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    const newUser = this.usersRepository.create(createUserDto);
    await newUser.hashPassword(createUserDto.password);

    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: [
        'id',
        'username',
        'password_hash',
        'email',
        'name',
        'bio',
        'profilePictureUrl',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.usersRepository.findOneBy({ id });
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (
      updateUserDto.username &&
      updateUserDto.username !== userToUpdate.username
    ) {
      const existingUser = await this.usersRepository.findOneBy({
        username: updateUserDto.username,
      });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Username already exists');
      }
    }
    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUser = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      await userToUpdate.hashPassword(updateUserDto.password);
      delete updateUserDto.password;
    }

    this.usersRepository.merge(userToUpdate, updateUserDto);

    return this.usersRepository.save(userToUpdate);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.usersRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
