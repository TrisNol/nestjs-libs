import { Inject, Injectable } from "@nestjs/common";
import { connectAsync, MqttClient } from "mqtt";
import { BufferStorage } from "./core";
import { MQTTConnectOptions } from "./core/mqtt-connect-options";
import { BUFFER_STORAGE, MQTT_CONNECT_OPTIONS } from "./core/constants";

@Injectable()
export class MQTTService {

    protected client: MqttClient | null = null;
    private isConnectected = false;

    constructor(
        @Inject(BUFFER_STORAGE) private readonly bufferService: BufferStorage,
        @Inject(MQTT_CONNECT_OPTIONS) private readonly options: MQTTConnectOptions
    ) { }

    public async init(): Promise<void> {
        if (this.client === null) {
            this.client = await connectAsync(this.options.url, {
                clientId: this.options.clientId
            });
            this.client.on("connect", this.onConnect.bind(this));
            this.client.on("close", this.onDisconnect.bind(this));
        }
    }

    protected async onConnect() {
        console.log("Connected to MQTT broker");
        this.isConnectected = true;
        const buffers = await this.bufferService.getAll();
        for (const buffer of buffers) {
            console.debug("Sending out buffered message with id ", buffer.id);
            await this.publish(buffer.topic, buffer.data, buffer.options.qos, buffer.options.retain);
        }
        this.bufferService.clear();

    }
    protected onDisconnect() {
        console.log("Disconnected from MQTT broker");
        this.isConnectected = false;
    }

    public async publish(topic: string, message: string, qos: 0 | 1 | 2 = 0, retain = false, stackBuffer = false): Promise<void> {
        if (this.isConnectected) {
            this.client!.publish(topic, message);
            return;
        }

        let buffer = null;
        if (stackBuffer) {
            buffer = await this.bufferService.add({ topic: topic, data: message, options: { qos, retain } });
        } else {
            buffer = await this.bufferService.set({ topic: topic, data: message, options: { qos, retain } });
        }
        console.warn("Could not send out message, put onto buffer with id", buffer.id);
        return
    }

}