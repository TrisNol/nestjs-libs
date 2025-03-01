import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { v4 } from 'uuid';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    Logger.debug("@Get() getData() called", AppController.name);
    return this.appService.getData();
  }

  @Get("test")
  getTest() {
    Logger.debug("@Get() test() called", AppController.name);
    return this.appService.test();
  }

  @Get("test/faulty")
  async getFaulty() {
    Logger.debug("@Get() getFaulty() called", AppController.name);
    const myID = v4();
    try {
      return await this.appService.faulty(myID);
    } catch (e) {
      Logger.error(e);
      // Error was thrown, check that rollback was successful
      const [device] = await Promise.all([
        this.appService.getById(myID)
      ]);
      if (device) {
        Logger.debug("Rollback failed")
        return "Rollback failed";
      } else {
        Logger.debug("Rollback successful")
        return "Rollback successful";
      }
    }
  }
}
