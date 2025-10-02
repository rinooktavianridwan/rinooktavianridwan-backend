import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const UpdateContactSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required').optional(),
  url: z.string().url('Invalid URL format').optional(),
  iconUrl: z.string().url('Invalid icon URL format').optional(),
  color: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

export type UpdateContactDto = z.infer<typeof UpdateContactSchema>;

export class UpdateContactRequest extends ZodUtils.createRequestDto(
  UpdateContactSchema,
) {}
