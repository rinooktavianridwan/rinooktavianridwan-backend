import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const UpdateTechnologySchema = z.object({
  name: z.string().min(1, 'Technology name is required').optional(),
  description: z.string().optional(),
  iconUrl: z.string().url('Invalid icon URL format').optional(),
  color: z.string().optional(),
  isVisible: z.boolean().optional(),
});

export type UpdateTechnologyDto = z.infer<typeof UpdateTechnologySchema>;

export class UpdateTechnologyRequest extends ZodUtils.createRequestDto(
  UpdateTechnologySchema,
) {}
