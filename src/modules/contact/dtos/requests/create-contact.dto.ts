import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const CreateContactSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  url: z.string().url('Invalid URL format'),
  iconUrl: z.string().url('Invalid icon URL format'),
  color: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

export type CreateContactDto = z.infer<typeof CreateContactSchema>;

export class CreateContactRequest extends ZodUtils.createRequestDto(
  CreateContactSchema,
) {}
