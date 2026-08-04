import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';
import { LoginRequest } from '../dtos/requests/login-auth.dto';
import { RegisterRequest } from '../dtos/requests/register-auth.dto';
import { User } from '../../../infrastructures/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findOneByUsername(username);
      const userEntity = user as User; // Proper type casting

      if (userEntity && (await userEntity.validatePassword(password))) {
        return user;
      }
      return null;
    } catch {
      return null;
    }
  }

  async login(
    loginDto: LoginRequest,
  ): Promise<{ user: IUser; access_token: string }> {
    const data = loginDto;
    const user = await this.validateUser(data.username, data.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    registerDto: RegisterRequest,
  ): Promise<{ user: IUser; access_token: string }> {
    const data = registerDto;

    await this.userRepository.create(registerDto);

    const user = await this.userRepository.findOneByUsername(data.username);
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: number): Promise<IUser> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }
    return user;
  }
}
