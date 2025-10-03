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

@Controller({
  path: 'contacts',
  version: '1',
})
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() request: CreateContactRequest,
    @Req() req: Request,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    await this.contactService.create(request);

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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateContactRequest,
    @Req() req: Request,
  ): Promise<IResponse<null>> {
    const version = req.url.split('/')[1].replace('v', '');
    await this.contactService.update(id, request);

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
