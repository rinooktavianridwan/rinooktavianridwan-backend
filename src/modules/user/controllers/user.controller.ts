import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { UserService } from '../services/user.service';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { UpdateUserRequest } from '../dtos/requests/update-user.dto';
import {
  PaginationQuery,
  PaginatedResponse,
} from '../../../common/utils/pagination.util';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { LocalMulterFile } from 'src/common/utils/upload.util';
import { JwtAuthGuard } from '../guards/create-jwt';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';
import {
  FileValidationPipe,
  ALLOWED_IMAGE_MIME_TYPES,
} from '../../../common/pipes/file-validation.pipe';

const profilePictureValidation = new FileValidationPipe({
  allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
});

interface AuthenticatedRequest extends Request {
  user: IUser;
  url: string;
}

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: PaginationQuery,
    @Req() req: Request,
  ): Promise<IResponse<PaginatedResponse<UserResponseDto>>> {
    const version = req.url.split('/')[1].replace('v', '');
    const paginatedResult = await this.userService.findAllPaginated(query);
    const responseData = {
      data: paginatedResult.data.map((user) =>
        UserResponseDto.fromEntity(user),
      ),
      meta: paginatedResult.meta,
    };

    return {
      status_code: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: responseData,
      version: `${version}.0.0`,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<IResponse<UserResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const user = await this.userService.findOne(id);

    return {
      status_code: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: UserResponseDto.fromEntity(user),
      version: `${version}.0.0`,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateUserRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');

    // User can only update their own profile
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    await this.userService.update(id, request);

    return {
      status_code: HttpStatus.OK,
      message: 'User updated successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');

    // User can only delete their own account
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    await this.userService.remove(id);

    return {
      status_code: HttpStatus.NO_CONTENT,
      message: 'User deleted successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }

  @Put(':id/profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // contoh: batasi 5MB
    }),
  )
  async updateProfilePicture(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(profilePictureValidation)
    file: Express.Multer.File, // multer memory file
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    // User can only update their own profile picture
    if (req.user.id !== id) {
      throw new ForbiddenException(
        'You can only update your own profile picture',
      );
    }

    const user = await this.userService.findOne(id);
    // cast Express.Multer.File ke LocalMulterFile sesuai utils (buffer & originalname)
    const localFile = {
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
    } as LocalMulterFile;

    await this.userService.updateProfilePicture(user, localFile);
  }
}
