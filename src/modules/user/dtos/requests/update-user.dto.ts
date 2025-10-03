import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const UpdateUserSchema = z.object({
  username: z.string().min(1, 'Username is required').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
  name: z.string().optional(),
  bio: z.string().optional(),
  profilePictureUrl: z
    .string()
    .url('Invalid profile picture URL format')
    .optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export class UpdateUserRequest extends ZodUtils.createRequestDto(
  UpdateUserSchema,
) {}
