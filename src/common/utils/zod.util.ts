import { z } from 'zod';

export class ZodUtils {
  /**
   * Create a Request DTO class from a Zod schema with camelCase keys.
   * This is only for incoming request validation.
   * @param schema - The Zod schema
   */
  static createRequestDto<T extends z.ZodTypeAny>(schema: T) {
    type InferredType = z.infer<T>;

    class RequestDto {
      constructor(data: InferredType) {
        Object.assign(this, data);
      }

      static validate(data: unknown): InferredType {
        return schema.parse(data);
      }
    }

    // Return the class without type assertion
    return RequestDto as unknown as new (data: InferredType) => InferredType;
  }
}
