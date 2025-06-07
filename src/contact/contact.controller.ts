import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactResponseDto } from './dto/contact-response.dto';

@Controller('contacts')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createContactDto: CreateContactDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactService.create(createContactDto);
    return ContactResponseDto.fromEntity(contact);
  }

  @Get()
  async findAll(): Promise<ContactResponseDto[]> {
    const contacts = await this.contactService.findAll();
    return contacts.map((contact) => ContactResponseDto.fromEntity(contact));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactService.findOne(id);
    return ContactResponseDto.fromEntity(contact);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactService.update(id, updateContactDto);
    return ContactResponseDto.fromEntity(contact);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.contactService.remove(id);
  }
}
