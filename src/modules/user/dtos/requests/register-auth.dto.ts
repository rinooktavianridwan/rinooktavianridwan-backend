import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  email: z.string().email('Invalid email format').optional(),
  name: z.string().optional(),
  bio: z.string().optional(),
  profilePictureUrl: z
    .string()
    .url('Invalid profile picture URL format')
    .optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export class RegisterRequest extends ZodUtils.createRequestDto(
  RegisterSchema,
) {}
