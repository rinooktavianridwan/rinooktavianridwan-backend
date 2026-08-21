import { ZodUtils, ZodCoerce, ZodSchemas } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const CreateContactSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  url: z.string().url('Invalid URL format'),
  iconUrl: ZodSchemas.iconUrl,
  color: z.string().optional(),
  order: z.preprocess(ZodCoerce.number, z.number().int().min(0)).optional(),
  isVisible: z.preprocess(ZodCoerce.boolean, z.boolean()).optional(),
});

export type CreateContactDto = z.infer<typeof CreateContactSchema>;

export class CreateContactRequest extends ZodUtils.createRequestDto(
  CreateContactSchema,
) {}
