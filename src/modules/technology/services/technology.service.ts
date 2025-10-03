import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ITechnology } from '../../../infrastructures/database/interfaces/technology-entity.interface';
import { TechnologyRepository } from '../repositories/technology.repository';
import {
  CreateTechnologyRequest,
  CreateTechnologyDto,
} from '../dtos/requests/create-technology.dto';
import {
  UpdateTechnologyRequest,
  UpdateTechnologyDto,
} from '../dtos/requests/update-technology.dto';
import {
  PaginatedResponse,
  PaginationQuery,
  PaginationUtil,
} from '../../../common/utils/pagination.util';

@Injectable()
export class TechnologyService {
  constructor(private readonly technologyRepository: TechnologyRepository) {}

  async create(createTechnologyDto: CreateTechnologyRequest): Promise<void> {
    const data = createTechnologyDto as unknown as CreateTechnologyDto;

    const existingTechnology = await this.technologyRepository.findOneByName(
      data.name,
    );
    if (existingTechnology) {
      throw new BadRequestException(
        `Technology '${data.name}' already exists.`,
      );
    }

    await this.technologyRepository.create(createTechnologyDto);
  }

  async findAllPaginated(
    query: PaginationQuery,
  ): Promise<PaginatedResponse<ITechnology>> {
    const { page, per_page, skip, take } =
      PaginationUtil.validatePaginationQuery(query);

    const { data, total } = await this.technologyRepository.findAllPaginated(
      skip,
      take,
    );

    return PaginationUtil.createPaginatedResponse(data, page, per_page, total);
  }

  async findOne(id: number): Promise<ITechnology> {
    const technology = await this.technologyRepository.findOneById(id);
    if (!technology) {
      throw new NotFoundException(`Technology with ID ${id} not found.`);
    }
    return technology;
  }

  async update(
    id: number,
    updateTechnologyDto: UpdateTechnologyRequest,
  ): Promise<void> {
    const technologyToUpdate = await this.technologyRepository.findOneById(id);
    if (!technologyToUpdate) {
      throw new NotFoundException(`Technology with ID ${id} not found.`);
    }

    const data = updateTechnologyDto as unknown as UpdateTechnologyDto;

    if (data.name && data.name !== technologyToUpdate.name) {
      const existingTechnology = await this.technologyRepository.findOneByName(
        data.name,
      );
      if (existingTechnology && existingTechnology.id !== id) {
        throw new BadRequestException(
          `Technology '${data.name}' already exists.`,
        );
      }
    }

    await this.technologyRepository.update(
      technologyToUpdate,
      updateTechnologyDto,
    );
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.technologyRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Technology with ID ${id} not found.`);
    }
  }
}
