# buffered-mqtt-adapter

This library provides the means to connect a NestJS application to an MQTT Broker in a way that ensures that outgoing messages are buffered in case of a broker downtime and sent out once a connection is re-established.
Although [mqtt.js](https://github.com/mqttjs/MQTT.js) already buffers outgoing messages by default, it does so indefinetely without proper control over whether messages shall be stacked or not. Considering applications where
messages pile up quickly and in case of a downtime not every single message needs to be received, this behaviour may lead to issues. Furthermore, it makes use of an in-memory storage which does not persist over a restart of the parent application.

## Usage

