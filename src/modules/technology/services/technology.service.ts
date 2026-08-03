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
import {
  LocalMulterFile,
  isMulterFile,
  saveUploadedFile,
  deleteUploadedFile,
} from 'src/common/utils/upload.util';

@Injectable()
export class TechnologyService {
  constructor(private readonly technologyRepository: TechnologyRepository) { }

  async create(
    createTechnologyDto: CreateTechnologyRequest,
    file?: LocalMulterFile,
  ): Promise<void> {
    const data = createTechnologyDto as unknown as CreateTechnologyDto;

    const existingTechnology = await this.technologyRepository.findOneByName(
      data.name,
    );
    if (existingTechnology) {
      throw new BadRequestException(
        `Technology '${data.name}' already exists.`,
      );
    }

    let uploadedUrl: string | undefined = undefined;
    try {
      if (file && isMulterFile(file)) {
        uploadedUrl = await saveUploadedFile('tech', file);
        (createTechnologyDto as CreateTechnologyDto).iconUrl = uploadedUrl;
      }

      await this.technologyRepository.create(createTechnologyDto);
    } catch (err) {
      if (uploadedUrl) {
        await deleteUploadedFile(uploadedUrl);
      }
      throw err;
    }
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
    file?: LocalMulterFile,
  ): Promise<void> {
    const technologyToUpdate = await this.technologyRepository.findOneById(id);
    if (!technologyToUpdate) {
      throw new NotFoundException(`Technology with ID ${id} not found.`);
    }

    // handle icon upload: upload first, keep old URL to delete after success
    let newIconUrl: string | undefined = undefined;
    if (file && isMulterFile(file)) {
      newIconUrl = await saveUploadedFile('tech', file);
      (updateTechnologyDto as UpdateTechnologyDto).iconUrl = newIconUrl;
    }

    try {
      await this.technologyRepository.update(
        technologyToUpdate,
        updateTechnologyDto,
      );

      // if update success and there was an old icon, delete it
      if (newIconUrl && technologyToUpdate.iconUrl) {
        await deleteUploadedFile(technologyToUpdate.iconUrl);
      }
    } catch (err) {
      // cleanup newly uploaded icon if DB failed
      if (newIconUrl) {
        await deleteUploadedFile(newIconUrl);
      }
      throw err;
    }
  }

  async findAllVisible(): Promise<ITechnology[]> {
    return await this.technologyRepository.findAllVisible();
  }

  async remove(id: number): Promise<void> {
    const isDeleted = await this.technologyRepository.deleteById(id);
    if (!isDeleted) {
      throw new NotFoundException(`Technology with ID ${id} not found.`);
    }
  }
}
