import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 공통주소
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // 세부주소
  getHello(): string {
    return this.appService.getHello();
  }
}
