import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
];

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  required?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  transform(file: Express.Multer.File | undefined): Express.Multer.File {
    // Check if file is required
    if (this.options.required && !file) {
      throw new BadRequestException('File is required');
    }

    // If file is not required and not provided, return undefined
    if (!file) {
      return file as unknown as Express.Multer.File;
    }

    validateFile(file, this.options);

    return file;
  }
}

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  transform(files: Express.Multer.File[] | undefined): Express.Multer.File[] {
    if (this.options.required && (!files || files.length === 0)) {
      throw new BadRequestException('At least one file is required');
    }

    if (!files) {
      return files as unknown as Express.Multer.File[];
    }

    for (const file of files) {
      validateFile(file, this.options);
    }

    return files;
  }
}

function validateFile(
  file: Express.Multer.File,
  options: FileValidationOptions,
): void {
  // Validate file size
  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
    throw new BadRequestException(
      `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    );
  }

  // Validate MIME type
  if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
    if (!options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${options.allowedMimeTypes.join(', ')}`,
      );
    }
  }
}
