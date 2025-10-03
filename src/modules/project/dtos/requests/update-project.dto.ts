import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const UpdateProjectImageSchema = z.object({
  id: z.number().int().positive().optional(),
  imageUrl: z.string().url('Invalid image URL format').optional(),
  order: z.number().int().min(0).optional(),
});

export const UpdateProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required').optional(),
  description: z.string().min(1, 'Project description is required').optional(),
  websiteUrl: z.string().url('Invalid website URL format').optional(),
  githubUrl: z.string().url('Invalid GitHub URL format').optional(),
  documentationUrl: z
    .string()
    .url('Invalid documentation URL format')
    .optional(),
  isVisible: z.boolean().optional(),
  userId: z.number().int().positive().optional(),
  technologyIds: z.array(z.number().int().positive()).optional(),
  images: z.array(UpdateProjectImageSchema).optional(),
  deleteImageIds: z.array(z.number().int().positive()).optional().default([]),
});

export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export type UpdateProjectImageDto = z.infer<typeof UpdateProjectImageSchema>;

export class UpdateProjectRequest extends ZodUtils.createRequestDto(
  UpdateProjectSchema,
) {}
