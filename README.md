# Cisco IoT Edge Gateway Telemetry Server

## Overview
This is a service intended to be deployed as an LXC/Docker container on Cisco IoT Edge Gateway products (IR 809, IR 829, IR 1101 series).

- Maintains an up-to-date registry of connected IoT devices to a specific IoT Edge Gateway
- Receives raw IoT sensor data (via MQTT) from MQTT clients
- Transforms received data to tag each event with specific IoT device ID
- Publishes transformed data over websocket as serialized utf-8 JSON

## Design


## Build

```shell
# as a standalone node.js application
npm install

# as a docker image
docker build -t <your_account>/telemetry-server <repo home>
```

## Run

The service exposes 2 ports by default:
- **1883** - MQTT broker
- **9999** - Websocket server

```shell
# as a standalone node.js application
npm start

# as a docker container
docker run -d -i                         \
  -p 1883:1883                           \
  -p 9999:9999                           \
  --name <container_name>                \
  <your_account>/telemetry-server
```

### Environment
The following environment variables can be overridden:

|ENV VAR|DESCRIPTION|DEFAULT VALUE|
|-----|--------|------------|
|`MQTT_BROKER_PORT`|Port to bind MQTT broker service|`1883`|
|`WS_SERVER_PORT`|Port to bind Websocket server|`9999`|
|`LOG_LEVEL`|Minimum log level (ref. [bunyan log levels](https://github.com/trentm/node-bunyan#levels))|`debug`|


### Logging
Logs are written to `/data/logs/edgedb.log` inside the container's filesystem.

If you need access to this from the underlying host, you can access it by interactively getting SSH access into the container with `docker exec -it sh <container_name>`.

## Credits
Implemented during a caffeine-fueled CodeFest at Develop@Cisco 2019
