import { ZodUtils } from 'src/common/utils/zod.util';
import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export class LoginRequest extends ZodUtils.createRequestDto(LoginSchema) {}
