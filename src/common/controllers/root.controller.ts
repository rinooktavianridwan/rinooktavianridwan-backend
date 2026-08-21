import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({ version: VERSION_NEUTRAL })
export class RootController {
  @Get()
  root() {
    return { status: 'ok', message: 'API is running', version: '1.0.0' };
  }
}