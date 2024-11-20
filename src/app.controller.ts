import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('aaa')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permissions', ['aaa'])
  aaa(): string {
    return 'aaaa';
  }

  @Get('bbb')
  @SetMetadata('require-login', true)
  bbb(): string {
    return 'bbb';
  }
}
