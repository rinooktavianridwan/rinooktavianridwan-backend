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
  async create(
    @Body() request: CreateProjectRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<ProjectResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    // Auto-assign userId from JWT token
    request.userId = req.user.id;
    const project = await this.projectService.create(request);

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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateProjectRequest,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<ProjectResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const project = await this.projectService.update(id, request);

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
