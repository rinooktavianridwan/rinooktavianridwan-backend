// src/portfolio/dto/create-project-image.dto.ts
import { IsNotEmpty, IsUrl, IsOptional, IsInt, Min } from 'class-validator';

export class CreateProjectImageDto {
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
