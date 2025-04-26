import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { v4 } from 'uuid';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AsyncContextual } from '@org/contextual-logging';
import { AvahiClientService } from '@org/avahi-client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2,
    private readonly avahiClient: AvahiClientService
  ) { }

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
    this.eventEmitter.emit("test", "test");
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

  @Get("test/avahi")
  async getAvahi() {
    Logger.debug("@Get() getAvahi() called", AppController.name);
    await this.avahiClient.scan();
    return "Avahi scan started";
  }

  @Get("test/avahi/respond")
  async getAvahiRespond() {
    Logger.debug("@Get() getAvahiRespond() called", AppController.name);
    await this.avahiClient.respond();
    return "Avahi respond started";
  }

  @OnEvent("test")
  @AsyncContextual()
  onTest(data: string) {
    Logger.warn("@OnEvent() onTest() called", AppController.name);
    Logger.warn(data);
  }
}
