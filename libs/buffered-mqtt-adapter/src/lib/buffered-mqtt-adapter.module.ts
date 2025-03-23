import { DynamicModule, Module } from '@nestjs/common';
import { MQTTConnectOptions } from './core/mqtt-connect-options';
import { MQTTService } from './mqtt.service';
import { BUFFER_STORAGE, MQTT_CONNECT_OPTIONS } from './core/constants';
import { BufferStorage } from './core';

@Module({ })
export class BufferedMqttAdapterModule {

  static forRoot(options: MQTTConnectOptions, bufferStorageProvider: BufferStorage): DynamicModule {
    return {
      module: BufferedMqttAdapterModule,
      providers: [
        {
          provide: MQTT_CONNECT_OPTIONS,
          useValue: options
        },
        {
          provide: BUFFER_STORAGE,
          useValue: bufferStorageProvider
        },
        MQTTService
      ],
      exports: [
        MQTTService,
        BUFFER_STORAGE
      ]
    }
  }
}
