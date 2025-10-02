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
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ContactService } from '../services/contact.service';
import { ContactResponseDto } from '../dtos/contact-response.dto';
import { CreateContactRequest } from '../dtos/requests/create-contact.dto';
import { UpdateContactRequest } from '../dtos/requests/update-contact.dto';

@Controller({
  path: 'contacts',
  version: '1',
})
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
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
  async findAll(@Req() req: Request): Promise<IResponse<ContactResponseDto[]>> {
    const version = req.url.split('/')[1].replace('v', '');
    const contacts = await this.contactService.findAll();

    return {
      status_code: HttpStatus.OK,
      message: 'Contacts retrieved successfully',
      data: contacts.map((contact) => ContactResponseDto.fromEntity(contact)),
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
