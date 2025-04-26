import { Module } from '@nestjs/common';
import { AvahiClientService } from './avahi-client-service/avahi-client.service';

@Module({
  controllers: [],
  providers: [AvahiClientService],
  exports: [AvahiClientService],
})
export class AvahiClientModule {}
