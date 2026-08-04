import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ProjectService } from '../services/project.service';
import { ProjectResponseDto } from '../dtos/responses/project-response.dto';
import { CreateProjectRequest } from '../dtos/requests/create-project.dto';
import { UpdateProjectRequest } from '../dtos/requests/update-project.dto';
import {
  PaginationQuery,
  PaginatedResponse,
} from '../../../common/utils/pagination.util';
import { JwtAuthGuard } from '../../user/guards/create-jwt';
import { IUser } from '../../../infrastructures/database/interfaces/user-entity.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import {
  FilesValidationPipe,
  ALLOWED_IMAGE_MIME_TYPES,
} from '../../../common/pipes/file-validation.pipe';

const imagesValidation = new FilesValidationPipe({
  allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
});

interface AuthenticatedRequest extends Request {
  user: IUser;
  url: string;
}

@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() request: CreateProjectRequest,
    @UploadedFiles(imagesValidation) files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<ProjectResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    request.userId = req.user.id;

    const localFiles =
      files?.map((f) => ({
        originalname: f.originalname,
        buffer: f.buffer,
        mimetype: f.mimetype,
        size: f.size,
      })) || [];

    const project = await this.projectService.create(request, localFiles);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Project created successfully',
      data: ProjectResponseDto.fromEntity(project),
      version: `${version}.0.0`,
    };
  }

  @Get()
  async findAll(
    @Query() query: PaginationQuery,
    @Req() req: Request,
  ): Promise<IResponse<PaginatedResponse<ProjectResponseDto>>> {
    const version = req.url.split('/')[1].replace('v', '');
    const paginatedResult = await this.projectService.findAllPaginated(query);
    const responseData = {
      data: paginatedResult.data.map((project) =>
        ProjectResponseDto.fromEntity(project),
      ),
      meta: paginatedResult.meta,
    };

    return {
      status_code: HttpStatus.OK,
      message: 'Projects retrieved successfully',
      data: responseData,
      version: `${version}.0.0`,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<IResponse<ProjectResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const project = await this.projectService.findOne(id);

    return {
      status_code: HttpStatus.OK,
      message: 'Project retrieved successfully',
      data: ProjectResponseDto.fromEntity(project),
      version: `${version}.0.0`,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateProjectRequest,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles(imagesValidation) files: Express.Multer.File[],
  ): Promise<IResponse<ProjectResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');

    const localFiles =
      files?.map((f) => ({
        originalname: f.originalname,
        buffer: f.buffer,
        mimetype: f.mimetype,
        size: f.size,
      })) || [];

    const project = await this.projectService.update(id, request, localFiles);

    return {
      status_code: HttpStatus.OK,
      message: 'Project updated successfully',
      data: ProjectResponseDto.fromEntity(project),
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
    await this.projectService.remove(id);

    return {
      status_code: HttpStatus.NO_CONTENT,
      message: 'Project deleted successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }
}
