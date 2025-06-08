// update-project.dto.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsArray, IsOptional, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProjectImageDto } from './update-project-image.dto';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['images'] as const),
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectImageDto)
  images?: UpdateProjectImageDto[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  hapus_gambar?: number[];
}
