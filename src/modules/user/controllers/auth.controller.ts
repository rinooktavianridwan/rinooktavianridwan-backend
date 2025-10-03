import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/create-jwt';
import { LoginRequest } from '../dtos/requests/login-auth.dto';
import { RegisterRequest } from '../dtos/requests/register-auth.dto';
import { AuthResponseDto } from '../dtos/responses/auth-response.dto';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { IResponse } from '../../../common/interfaces/response.interface';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';

interface AuthenticatedRequest extends Request {
  user: IUser;
  url: string;
}

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginRequest,
    @Req() req: Request,
  ): Promise<IResponse<AuthResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const result = await this.authService.login(loginDto);

    return {
      status_code: HttpStatus.OK,
      message: 'Login successful',
      data: AuthResponseDto.create(result.user, result.access_token),
      version: `${version}.0.0`,
    };
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterRequest,
    @Req() req: Request,
  ): Promise<IResponse<AuthResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const result = await this.authService.register(registerDto);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Registration successful',
      data: AuthResponseDto.create(result.user, result.access_token),
      version: `${version}.0.0`,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<UserResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const user = await this.authService.getProfile(req.user.id);

    return {
      status_code: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data: UserResponseDto.fromEntity(user),
      version: `${version}.0.0`,
    };
  }
}
