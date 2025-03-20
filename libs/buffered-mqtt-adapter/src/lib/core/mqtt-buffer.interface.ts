import { MQTTPublishOptions } from "./mqtt-publish-options";

/**
 * Interface for a buffer containing a topic, data and options to be used when publishing the MQTT message.
 */
export interface MQTTBuffer {
    topic: string;
    data: string;
    options: MQTTPublishOptions;
}
