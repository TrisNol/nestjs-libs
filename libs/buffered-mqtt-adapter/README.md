# buffered-mqtt-adapter

This library provides the means to connect a NestJS application to an MQTT Broker in a way that ensures that outgoing messages are buffered in case of a broker downtime and sent out once a connection is re-established.

## Usage