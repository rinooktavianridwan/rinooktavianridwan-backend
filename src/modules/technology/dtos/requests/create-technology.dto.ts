import { ZodUtils, ZodCoerce, ZodSchemas } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const CreateTechnologySchema = z.object({
  name: z.string().min(1, 'Technology name is required'),
  description: z.string().optional(),
  iconUrl: ZodSchemas.iconUrl.optional(),
  color: z.string().optional(),
  isVisible: z
    .preprocess(ZodCoerce.boolean, z.boolean())
    .optional()
    .default(true),
});

export type CreateTechnologyDto = z.infer<typeof CreateTechnologySchema>;

export class CreateTechnologyRequest extends ZodUtils.createRequestDto(
  CreateTechnologySchema,
) {}
