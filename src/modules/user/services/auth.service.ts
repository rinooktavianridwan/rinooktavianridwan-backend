import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';
import { LoginRequest, LoginDto } from '../dtos/requests/login-auth.dto';
import {
  RegisterRequest,
  RegisterDto,
} from '../dtos/requests/register-auth.dto';
import { User } from '../../../infrastructures/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUser | null> {
    try {
      const user = await this.userService.findOneByUsername(username);
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
    const data = loginDto as unknown as LoginDto;
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
    const data = registerDto as unknown as RegisterDto;

    // Create user through UserService (it handles validation)
    await this.userService.create(registerDto);

    // Get the created user and generate token
    const user = await this.userService.findOneByUsername(data.username);

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
    return await this.userService.findOne(userId);
  }
}
