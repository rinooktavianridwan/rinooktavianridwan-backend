import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  HttpStatus,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ContactService } from '../services/contact.service';
import { ContactResponseDto } from '../dtos/responses/contact-response.dto';
import { CreateContactRequest } from '../dtos/requests/create-contact.dto';
import { UpdateContactRequest } from '../dtos/requests/update-contact.dto';
import {
  PaginationQuery,
  PaginatedResponse,
} from '../../../common/utils/pagination.util';
import { JwtAuthGuard } from '../../user/guards/create-jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { LocalMulterFile } from 'src/common/utils/upload.util';
import {
  FileValidationPipe,
  ALLOWED_IMAGE_MIME_TYPES,
} from 'src/common/pipes/file-validation.pipe';

const iconValidation = new FileValidationPipe({
  allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
});

@Controller({
  path: 'contacts',
  version: '1',
})
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() request: CreateContactRequest,
    @Req() req: Request,
    @UploadedFile(iconValidation) file?: Express.Multer.File,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    const localFile = file
      ? ({
          originalname: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
        } as LocalMulterFile)
      : undefined;
    await this.contactService.create(request, localFile);

    return {
      status_code: HttpStatus.CREATED,
      message: 'Contact created successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }

  @Get()
  async findAll(
    @Query() query: PaginationQuery,
    @Req() req: Request,
  ): Promise<IResponse<PaginatedResponse<ContactResponseDto>>> {
    const version = req.url.split('/')[1].replace('v', '');
    const paginatedResult = await this.contactService.findAllPaginated(query);
    const responseData = {
      data: paginatedResult.data.map((contact) =>
        ContactResponseDto.fromEntity(contact),
      ),
      meta: paginatedResult.meta,
    };

    return {
      status_code: HttpStatus.OK,
      message: 'Contacts retrieved successfully',
      data: responseData,
      version: `${version}.0.0`,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<IResponse<ContactResponseDto>> {
    const version = req.url.split('/')[1].replace('v', '');
    const contact = await this.contactService.findOne(id);

    return {
      status_code: HttpStatus.OK,
      message: 'Contact retrieved successfully',
      data: ContactResponseDto.fromEntity(contact),
      version: `${version}.0.0`,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateContactRequest,
    @Req() req: Request,
    @UploadedFile(iconValidation) file?: Express.Multer.File,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    const localFile = file
      ? ({
          originalname: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
        } as LocalMulterFile)
      : undefined;
    await this.contactService.update(id, request, localFile);

    return {
      status_code: HttpStatus.OK,
      message: 'Contact updated successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    await this.contactService.remove(id);

    return {
      status_code: HttpStatus.OK,
      message: 'Contact deleted successfully',
      data: null,
      version: `${version}.0.0`,
    };
  }
}
