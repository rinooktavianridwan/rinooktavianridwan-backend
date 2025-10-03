import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const CreateTechnologySchema = z.object({
  name: z.string().min(1, 'Technology name is required'),
  description: z.string().optional(),
  iconUrl: z.string().url('Invalid icon URL format').optional(),
  color: z.string().optional(),
  isVisible: z.boolean().optional().default(true),
});

export type CreateTechnologyDto = z.infer<typeof CreateTechnologySchema>;

export class CreateTechnologyRequest extends ZodUtils.createRequestDto(
  CreateTechnologySchema,
) {}
