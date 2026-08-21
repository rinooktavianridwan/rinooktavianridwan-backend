import { ZodUtils, ZodCoerce, ZodSchemas } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const UpdateContactSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required').optional(),
  url: z.string().url('Invalid URL format').optional(),
  iconUrl: ZodSchemas.iconUrl.optional(),
  color: z.string().optional(),
  order: z.preprocess(ZodCoerce.number, z.number().int().min(0)).optional(),
  isVisible: z.preprocess(ZodCoerce.boolean, z.boolean()).optional(),
});

export type UpdateContactDto = z.infer<typeof UpdateContactSchema>;

export class UpdateContactRequest extends ZodUtils.createRequestDto(
  UpdateContactSchema,
) {}
