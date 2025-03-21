import { Injectable } from "@nestjs/common";
import { BufferStorage, StoredMQTTBufer } from "../core/buffer-storage.interface";
import { MQTTBuffer } from "../core/mqtt-buffer.interface";

import {v4 as uuid_v4} from 'uuid';

/**
 * Service for in-memory storage of MQTT buffers, implementing the `BufferStorage` interface.
 * This service allows storing, retrieving, and managing MQTT buffers grouped by topics.
 */
@Injectable()
export class InMemoryBufferStorage implements BufferStorage {
    private readonly buffers: { [topic: string]: StoredMQTTBufer[] } = {};

    set(buffer: MQTTBuffer): StoredMQTTBufer {
        if (!this.buffers[buffer.topic]) {
            this.buffers[buffer.topic] = [];
        }
        const bufferToStore = {...buffer, id: uuid_v4()};
        this.buffers[buffer.topic] = [bufferToStore];
        return bufferToStore;
    }

    add(buffer: MQTTBuffer): StoredMQTTBufer  {
        if (!this.buffers[buffer.topic]) {
            this.buffers[buffer.topic] = [];
        }
        const bufferToStore = {...buffer, id: uuid_v4()};
        this.buffers[buffer.topic].push(bufferToStore);
        return bufferToStore;
    }

    getAll(): StoredMQTTBufer[] {
        return Object.values(this.buffers).reduce((acc, val) => acc.concat(val), []);
    }

    getByTopic(topic: string): StoredMQTTBufer[] {
        return this.buffers[topic] || [];
    }

    removeByTopic(topic: string): void  {
        delete this.buffers[topic];
    }

    removeById(id: string): void | Promise<void> {
        for (const topic in this.buffers) {
            this.buffers[topic] = this.buffers[topic].filter(buffer => buffer.id !== id);
        }
    }
    
    clear(): void  {
        for (const topic in this.buffers) {
            delete this.buffers[topic];
        }
    }
}