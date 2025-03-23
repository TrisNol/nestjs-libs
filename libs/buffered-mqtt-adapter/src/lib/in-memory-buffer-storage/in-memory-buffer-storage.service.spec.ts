import { InMemoryBufferStorage } from './in-memory-buffer-storage.service';
import { MQTTBuffer } from '../core/mqtt-buffer.interface';

describe(InMemoryBufferStorage.name, () => {
    let service: InMemoryBufferStorage;

    beforeEach(() => {
        service = new InMemoryBufferStorage();
    });

    it('should set a buffer and replace existing buffers for the same topic', () => {
        const buffer: MQTTBuffer = { topic: 'test/topic', data: 'data', options: {qos: 0, retain: false} };
        const storedBuffer = service.set(buffer);

        expect(storedBuffer).toHaveProperty('id');
        expect(service.getByTopic('test/topic')).toHaveLength(1);
        expect(service.getByTopic('test/topic')[0]).toEqual(storedBuffer);
    });

    it('should add a buffer to an existing topic', () => {
        const buffer1: MQTTBuffer = { topic: 'test/topic', data: 'data1', options: {qos: 0, retain: false} };
        const buffer2: MQTTBuffer = { topic: 'test/topic', data: 'data2', options: {qos: 0, retain: false} };

        service.add(buffer1);
        const storedBuffer2 = service.add(buffer2);

        expect(storedBuffer2).toHaveProperty('id');
        expect(service.getByTopic('test/topic')).toHaveLength(2);
    });

    it('should retrieve all stored buffers', () => {
        const buffer1: MQTTBuffer = { topic: 'topic1', data: 'data1', options: {qos: 0, retain: false} };
        const buffer2: MQTTBuffer = { topic: 'topic2', data: 'data2', options: {qos: 0, retain: false} };

        service.add(buffer1);
        service.add(buffer2);

        const allBuffers = service.getAll();
        expect(allBuffers).toHaveLength(2);
    });

    it('should retrieve buffers by topic', () => {
        const buffer: MQTTBuffer = { topic: 'test/topic', data: 'data', options: {qos: 0, retain: false} };
        service.add(buffer);

        const buffers = service.getByTopic('test/topic');
        expect(buffers).toHaveLength(1);
        expect(buffers[0].data).toBe('data');
    });

    it('should remove buffers by topic', () => {
        const buffer: MQTTBuffer = { topic: 'test/topic', data: 'data', options: {qos: 0, retain: false} };
        service.add(buffer);

        service.removeByTopic('test/topic');
        expect(service.getByTopic('test/topic')).toHaveLength(0);
    });

    it('should remove a buffer by ID', () => {
        const buffer1: MQTTBuffer = { topic: 'test/topic', data: 'data1', options: {qos: 0, retain: false} };
        const buffer2: MQTTBuffer = { topic: 'test/topic', data: 'data2', options: {qos: 0, retain: false} };

        const storedBuffer1 = service.add(buffer1);
        service.add(buffer2);

        service.removeById(storedBuffer1.id);
        const remainingBuffers = service.getByTopic('test/topic');

        expect(remainingBuffers).toHaveLength(1);
        expect(remainingBuffers[0].data).toBe('data2');
    });

    it('should clear all buffers', () => {
        const buffer1: MQTTBuffer = { topic: 'topic1', data: 'data1', options: {qos: 0, retain: false} };
        const buffer2: MQTTBuffer = { topic: 'topic2', data: 'data2', options: {qos: 0, retain: false} };

        service.add(buffer1);
        service.add(buffer2);

        service.clear();
        expect(service.getAll()).toHaveLength(0);
    });
});
