import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { ZodError } from 'zod';

interface ZodDto {
  validate(data: unknown): unknown;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });

  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    const metatype = metadata.metatype as unknown as ZodDto | undefined;

    if (metatype && typeof metatype.validate === 'function') {
      try {
        return metatype.validate(value);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new BadRequestException(this.formatZodError(error));
        }
        throw error;
      }
    }

    // Fallback to class-validator for non-Zod DTOs
    return this.validationPipe.transform(value, metadata);
  }

  private formatZodError(error: ZodError): string[] {
    return error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'value';
      return `${path}: ${issue.message}`;
    });
  }
}
