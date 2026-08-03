import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';
import { UserRepository } from '../repositories/user.repository';
import {
  UpdateUserRequest,
  UpdateUserDto,
} from '../dtos/requests/update-user.dto';
import {
  PaginatedResponse,
  PaginationQuery,
  PaginationUtil,
} from '../../../common/utils/pagination.util';
import {
  saveUploadedFile,
  deleteUploadedFile,
  isMulterFile,
  LocalMulterFile,
} from 'src/common/utils/upload.util';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

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

  async updateProfilePicture(
    user: IUser,
    file?: LocalMulterFile,
  ): Promise<void> {
    if (!file || !isMulterFile(file)) {
      throw new BadRequestException('Invalid or missing file');
    }
    const mf = file;

    // delete existing file if present
    if (user.profilePictureUrl) {
      await deleteUploadedFile(user.profilePictureUrl);
    }

    const publicPath = await saveUploadedFile('profile', mf);

    const updatePayload = {
      profilePictureUrl: publicPath,
    } as unknown as UpdateUserRequest;
    await this.userRepository.update(user, updatePayload);
  }

  async findMainProfile(): Promise<IUser | null> {
    // For now, return the first user. Can be enhanced with isMainProfile flag
    const { data } = await this.userRepository.findAllPaginated(0, 1);
    return data.length > 0 ? data[0] : null;
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.userRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
