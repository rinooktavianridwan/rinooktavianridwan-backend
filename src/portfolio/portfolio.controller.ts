import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';

@Controller('projects')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PortfolioController {
  constructor(private readonly projectService: PortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.create(createProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  @Get()
  async findAll(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectService.findAll();
    return projects.map((project) => ProjectResponseDto.fromEntity(project));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.findOne(id);
    return ProjectResponseDto.fromEntity(project);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.update(id, updateProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projectService.remove(id);
  }
}
