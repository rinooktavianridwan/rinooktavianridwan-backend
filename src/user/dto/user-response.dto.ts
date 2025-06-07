import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  username: string;
  email?: string;
  name?: string;
  bio?: string;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.email = user.email;
    dto.name = user.name;
    dto.bio = user.bio;
    dto.profilePictureUrl = user.profilePictureUrl;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
