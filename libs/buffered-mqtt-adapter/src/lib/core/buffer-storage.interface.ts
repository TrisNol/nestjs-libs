import { MQTTBuffer } from "./mqtt-buffer.interface";

export class StoredMQTTBufer extends MQTTBuffer {
    id!: string;
}

/**
 * Base interface for a buffer storage providing the base methods 
 * to store and retrieve buffers.
 */
export interface BufferStorage {
    /**
     * Places the given buffer in the storage. Makes sure that 
     * only a single buffer with the same topic is stored.
     * @param buffer Buffer to store
     */
    set(buffer: MQTTBuffer): StoredMQTTBufer | Promise<StoredMQTTBufer>;
    /**
     * Adds the given buffer to the storage. Allows multiple 
     * buffers with the same topic to be stored.
     * @param buffer Buffer to add
     */
    add(buffer: MQTTBuffer): StoredMQTTBufer | Promise<StoredMQTTBufer>;
    /**
     * Retrieves all buffers stored in the storage.
     * @returns All stored buffers
     */
    getAll(): StoredMQTTBufer[] | Promise<StoredMQTTBufer[]>;
    /**
     * Retrieves all buffers with the given topic.
     * @param topic Topic to filter by
     * @returns All stored buffers with the given topic
     */
    getByTopic(topic: string): StoredMQTTBufer[] | Promise<StoredMQTTBufer[]>;
    /**
     * Removes all buffers with the given topic.
     * @param topic Topic to filter by
     */
    removeByTopic(topic: string): void | Promise<void>;
    /**
     * Removes the buffer with the given id.
     * @param id Id of the buffer to remove
     */
    removeById(id: string): void | Promise<void>;
    /**
     * Removes all buffers stored in the storage.
     */
    clear(): void | Promise<void>;
}