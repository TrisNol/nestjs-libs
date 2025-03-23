/**
 * Options for publishing an MQTT message.
 */
export class MQTTPublishOptions {
    qos: 0 | 1 | 2 = 0;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    retain: boolean = false;
}
