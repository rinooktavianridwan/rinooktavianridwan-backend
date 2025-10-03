import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';
import { UserRepository } from '../repositories/user.repository';
import {
  CreateUserRequest,
  CreateUserDto,
} from '../dtos/requests/create-user.dto';
import {
  UpdateUserRequest,
  UpdateUserDto,
} from '../dtos/requests/update-user.dto';
import {
  PaginatedResponse,
  PaginationQuery,
  PaginationUtil,
} from '../../../common/utils/pagination.util';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserRequest): Promise<void> {
    const data = createUserDto as unknown as CreateUserDto;

    const existingUserByUsername = await this.userRepository.findOneByUsername(
      data.username,
    );
    if (existingUserByUsername) {
      throw new BadRequestException('Username already exists');
    }

    if (data.email) {
      const existingUserByEmail = await this.userRepository.findOneByEmail(
        data.email,
      );
      if (existingUserByEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    await this.userRepository.create(createUserDto);
  }

  async findAllPaginated(
    query: PaginationQuery,
  ): Promise<PaginatedResponse<IUser>> {
    const { page, per_page, skip, take } =
      PaginationUtil.validatePaginationQuery(query);

    const { data, total } = await this.userRepository.findAllPaginated(
      skip,
      take,
    );

    return PaginationUtil.createPaginatedResponse(data, page, per_page, total);
  }

  async findOne(id: number): Promise<IUser> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<IUser> {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserRequest): Promise<void> {
    const userToUpdate = await this.userRepository.findOneById(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const data = updateUserDto as unknown as UpdateUserDto;

    if (data.username && data.username !== userToUpdate.username) {
      const existingUser = await this.userRepository.findOneByUsername(
        data.username,
      );
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (data.email && data.email !== userToUpdate.email) {
      const existingUser = await this.userRepository.findOneByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }

    await this.userRepository.update(userToUpdate, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.userRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
