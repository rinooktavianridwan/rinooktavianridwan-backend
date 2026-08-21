import { z } from 'zod';

/**
 * Coercion helpers for values coming from multipart/form-data.
 * Multer turns every field into a string, so typed fields (number,
 * boolean, array) need explicit conversion before Zod validation.
 */
export const ZodCoerce = {
  boolean: (v: unknown) => {
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
    return v;
  },
  number: (v: unknown) => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) {
      return Number(v);
    }
    return v;
  },
  json: (v: unknown) => {
    if (typeof v === 'string') {
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    }
    return v;
  },
  numberArray: (v: unknown) => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      try {
        const parsed: unknown = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fall through to comma-separated parsing
      }
      const parts = v
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');
      if (parts.length > 0 && parts.every((p) => !Number.isNaN(Number(p)))) {
        return parts.map(Number);
      }
    }
    return v;
  },
};

export const ZodSchemas = {
  /**
   * Accepts a full URL (https://...), a relative storage path (/storages/...),
   * or a single emoji (e.g. ⚛️). Used for iconUrl fields where the public UI
   * supports emoji icons and uploaded icons are stored under /storages/.
   */
  iconUrl: z
    .string()
    .refine(
      (value) => /^(https?:\/\/|\/storages\/|\p{Emoji})/u.test(value),
      'Invalid icon URL format',
    ),
};

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
