import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { v4 } from 'uuid';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get("test")
  getTest() {
    return this.appService.test();
  }

  @Get("test/faulty")
  async getFaulty() {
    const myID = v4();
    try {
      return await this.appService.faulty(myID);
    } catch (e) {
      Logger.error(e);
      // Error was thrown, check that rollback was successful
      const device = await this.appService.getById(myID);
      if (device) {
        return "Rollback failed";
      } else {
        return "Rollback successful";
      }
    }
  }
}
