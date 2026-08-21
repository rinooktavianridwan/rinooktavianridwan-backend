import { ZodUtils, ZodCoerce, ZodSchemas } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const UpdateTechnologySchema = z.object({
  name: z.string().min(1, 'Technology name is required').optional(),
  description: z.string().optional(),
  iconUrl: ZodSchemas.iconUrl.optional(),
  color: z.string().optional(),
  isVisible: z.preprocess(ZodCoerce.boolean, z.boolean()).optional(),
});

export type UpdateTechnologyDto = z.infer<typeof UpdateTechnologySchema>;

export class UpdateTechnologyRequest extends ZodUtils.createRequestDto(
  UpdateTechnologySchema,
) {}
