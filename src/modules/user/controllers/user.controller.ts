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

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateUserRequest,
    @Req() req: Request,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
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
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    await this.userService.remove(id);

    return {
      status_code: HttpStatus.NO_CONTENT,
      message: 'User deleted successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }

  @Put(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // contoh: batasi 5MB
    }),
  )
  async updateProfilePicture(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File, // multer memory file
  ): Promise<void> {
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
