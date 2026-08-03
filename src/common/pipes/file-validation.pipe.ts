import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface FileValidationOptions {
    maxSize?: number; // in bytes
    allowedMimeTypes?: string[];
    required?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
    constructor(private readonly options: FileValidationOptions = {}) { }

    transform(file: Express.Multer.File | undefined): Express.Multer.File {
        // Check if file is required
        if (this.options.required && !file) {
            throw new BadRequestException('File is required');
        }

        // If file is not required and not provided, return undefined
        if (!file) {
            return file as unknown as Express.Multer.File;
        }

        // Validate file size
        if (this.options.maxSize && file.size > this.options.maxSize) {
            const maxSizeMB = (this.options.maxSize / (1024 * 1024)).toFixed(2);
            throw new BadRequestException(
                `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
            );
        }

        // Validate MIME type
        if (
            this.options.allowedMimeTypes &&
            this.options.allowedMimeTypes.length > 0
        ) {
            if (!this.options.allowedMimeTypes.includes(file.mimetype)) {
                throw new BadRequestException(
                    `Invalid file type. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
                );
            }
        }

        return file;
    }
}
