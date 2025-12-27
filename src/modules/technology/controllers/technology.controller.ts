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
  UploadedFile,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { TechnologyService } from '../services/technology.service';
import { TechnologyResponseDto } from '../dtos/responses/technology-response.dto';
import { CreateTechnologyRequest } from '../dtos/requests/create-technology.dto';
import { UpdateTechnologyRequest } from '../dtos/requests/update-technology.dto';
import {
  PaginationQuery,
  PaginatedResponse,
} from '../../../common/utils/pagination.util';
import { JwtAuthGuard } from '../../user/guards/create-jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { LocalMulterFile } from 'src/common/utils/upload.util';

@Controller({
  path: 'technologies',
  version: '1',
})
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() request: CreateTechnologyRequest,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    const localFile = file
      ? ({
          originalname: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
        } as LocalMulterFile)
      : undefined;
    await this.technologyService.create(request, localFile);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Technology created successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }

  @Get()
  async findAll(
    @Query() query: PaginationQuery,
    @Req() req: Request,
  ): Promise<IResponse<PaginatedResponse<TechnologyResponseDto>>> {
    const version = req.url.split('/')[1].replace('v', '');
    const paginatedResult =
      await this.technologyService.findAllPaginated(query);
    const responseData = {
      data: paginatedResult.data.map((technology) =>
        TechnologyResponseDto.fromEntity(technology),
      ),
      meta: paginatedResult.meta,
    };

    return {
      status_code: HttpStatus.OK,
      message: 'Technologies retrieved successfully',
      data: responseData,
      version: `${version}.0.0`,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<IResponse<TechnologyResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const technology = await this.technologyService.findOne(id);

    return {
      status_code: HttpStatus.OK,
      message: 'Technology retrieved successfully',
      data: TechnologyResponseDto.fromEntity(technology),
      version: `${version}.0.0`,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateTechnologyRequest,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    const localFile = file
      ? ({
          originalname: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
        } as LocalMulterFile)
      : undefined;
    await this.technologyService.update(id, request, localFile);

    return {
      status_code: HttpStatus.OK,
      message: 'Technology updated successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    await this.technologyService.remove(id);

    return {
      status_code: HttpStatus.NO_CONTENT,
      message: 'Technology deleted successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }
}
