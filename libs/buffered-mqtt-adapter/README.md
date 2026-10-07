# buffered-mqtt-adapter

This library provides the means to connect a NestJS application to an MQTT Broker in a way that ensures that outgoing messages are buffered in case of a broker downtime and sent out once a connection is re-established.
Although [mqtt.js](https://github.com/mqttjs/MQTT.js) already buffers outgoing messages by default, it does so indefinitely without proper control over whether messages shall be stacked or not. Considering applications where
messages pile up quickly and in case of a downtime not every single message needs to be received, this behaviour may lead to issues. Furthermore, it makes use of an in-memory storage which does not persist over a restart of the parent application.

Using the code provided within this lib, one gains more granular control over whether messages shall be stacked or not.

## Usage

1. Consider developing your own custom implementation of the [`BufferStorage`](./src/lib/core/buffer-storage.interface.ts) interface in order to persistently store buffered MQTT messages somewhere (e.g., Redis, PostgreSQL or MongoDB).
2. Register the [`BufferedMqttAdapterModule`](./src/lib/buffered-mqtt-adapter.module.ts) within your `AppModule` like so:
    ```ts
    @Module({
    imports: [
        BufferedMqttAdapterModule.forRoot(
        {
            url: "mqtt://localhost:1883", // Override depending on your connection string
            clientId: "nestjs-server" // Can be left empty to generate a random one
        }, 
        new InMemoryBufferStorage() // 👈 Override with a custom implementation if needed 
        ),
        /* other imports */
    ],
    /* controllers ets. */
    })
    export class AppModule { }
    ```
3. Inject the [`MQTTService`](./src/lib/mqtt.service.ts) in your services and use it's `publish` method to send out MQTT messages:
    ```ts
    @Injectable()
    export class AppService implements OnModuleInit {
    constructor(
        private readonly mqttService: MQTTService
    ) { }
    
    async onModuleInit() {
        await this.mqttService.init()
    }

    public async hello(): Promise<void> {
        await this.mqttService.publish("test/hello", "Hello there!", 2, false, true) // 👈 if stackBuffer is set to true messages will be stacked rather than replaced 
    }
    ```

