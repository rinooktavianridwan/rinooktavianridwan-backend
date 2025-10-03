import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from '../../../infrastructures/database/entities/technology.entity';
import { ITechnology } from '../../../infrastructures/database/interfaces/technology-entity.interface';
import { CreateTechnologyRequest } from '../dtos/requests/create-technology.dto';
import { UpdateTechnologyRequest } from '../dtos/requests/update-technology.dto';

@Injectable()
export class TechnologyRepository {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<ITechnology>,
  ) {}

  async create(createTechnologyDto: CreateTechnologyRequest): Promise<void> {
    const newTechnology = this.technologyRepository.create(createTechnologyDto);
    await this.technologyRepository.save(newTechnology);
  }

  async findAllPaginated(
    skip: number,
    take: number,
  ): Promise<{ data: ITechnology[]; total: number }> {
    const [data, total] = await this.technologyRepository.findAndCount({
      order: { name: 'ASC' },
      skip,
      take,
    });

    return { data, total };
  }

  async findOneById(id: number): Promise<ITechnology | null> {
    return await this.technologyRepository.findOneBy({ id });
  }

  async findOneByName(name: string): Promise<ITechnology | null> {
    return await this.technologyRepository.findOneBy({ name });
  }

  async update(
    technology: ITechnology,
    updateTechnologyDto: UpdateTechnologyRequest,
  ): Promise<void> {
    this.technologyRepository.merge(
      technology as Technology,
      updateTechnologyDto,
    );
    await this.technologyRepository.save(technology as Technology);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.technologyRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
