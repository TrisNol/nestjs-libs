import { Injectable } from "@nestjs/common";
import { BufferStorage } from "../core/buffer-storage.interface";
import { MQTTBuffer } from "../core/mqtt-buffer.interface";

/**
 * Service for in-memory storage of MQTT buffers, implementing the `BufferStorage` interface.
 * This service allows storing, retrieving, and managing MQTT buffers grouped by topics.
 */
@Injectable()
export class InMemoryBufferStorage implements BufferStorage {
    private readonly buffers: { [topic: string]: MQTTBuffer[] } = {};

    set(buffer: MQTTBuffer): void {
        if (!this.buffers[buffer.topic]) {
            this.buffers[buffer.topic] = [];
        }
        this.buffers[buffer.topic] = [buffer];
    }

    add(buffer: MQTTBuffer): void  {
        if (!this.buffers[buffer.topic]) {
            this.buffers[buffer.topic] = [];
        }
        this.buffers[buffer.topic].push(buffer);
    }

    getAll(): MQTTBuffer[] {
        return Object.values(this.buffers).reduce((acc, val) => acc.concat(val), []);
    }

    getByTopic(topic: string): MQTTBuffer[] {
        return this.buffers[topic] || [];
    }

    removeByTopic(topic: string): void  {
        delete this.buffers[topic];
    }
    
    clear(): void  {
        for (const topic in this.buffers) {
            delete this.buffers[topic];
        }
    }
}