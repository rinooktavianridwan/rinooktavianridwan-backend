import { IsInt, IsOptional, IsUrl, Min } from 'class-validator';

export class UpdateProjectImageDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  order?: number;
}
