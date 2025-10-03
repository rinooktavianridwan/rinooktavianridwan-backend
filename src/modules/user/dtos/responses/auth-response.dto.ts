import { IUser } from '../../../../infrastructures/database/interfaces/user-entity.interface';
import { UserResponseDto } from '../../../user/dtos/responses/user-response.dto';

export class AuthResponseDto {
  user: UserResponseDto;
  access_token: string;

  static create(user: IUser, access_token: string): AuthResponseDto {
    const dto = new AuthResponseDto();
    dto.user = UserResponseDto.fromEntity(user);
    dto.access_token = access_token;
    return dto;
  }
}
