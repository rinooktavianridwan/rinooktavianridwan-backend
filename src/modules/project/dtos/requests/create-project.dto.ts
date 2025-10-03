import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const CreateProjectImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL format'),
  order: z.number().int().min(0).optional().default(0),
});

export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  websiteUrl: z.string().url('Invalid website URL format').optional(),
  githubUrl: z.string().url('Invalid GitHub URL format').optional(),
  documentationUrl: z
    .string()
    .url('Invalid documentation URL format')
    .optional(),
  isVisible: z.boolean().optional().default(true),
  userId: z.number().int().positive().optional(),
  technologyIds: z.array(z.number().int().positive()).optional().default([]),
  images: z.array(CreateProjectImageSchema).optional().default([]),
});

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type CreateProjectImageDto = z.infer<typeof CreateProjectImageSchema>;

export class CreateProjectRequest extends ZodUtils.createRequestDto(
  CreateProjectSchema,
) {}
