const mosca = require("mosca");
const _ = require("lodash");
const logger = require("./utils/logger");

const devices = new Map();
const receivers = new Map();
let broker;

const _createMQTTBroker = (port) => {
    const server = new mosca.Server({
        port,
        logger: {
            childOf: logger,
        },
    });

    server.on("ready", () => {
        logger.info(`MQTT broker READY on port ${port}`);
    });

    return server;
};

const _addDevice = (topic) => {
    const elems = topic.split("/");
    if (devices.has(elems[1])) {
        return;
    }
    logger.info(`Adding device ${elems[1]} to list of devices.`);
    devices.set(elems[1], topic);
    logger.info(`Connected devices: ${devices.size}`);
};

const _notifyRegisteredReceiver = (topic, payloadJsonStr) => {
    const receiverFn = receivers.get(topic);
    if (_.isFunction(receiverFn)) {
        const payloadObj = JSON.parse(payloadJsonStr);
        payloadObj.id = topic.split("/")[1];
        logger.debug(`Received telemetry event on topic ${topic}: ${payloadJsonStr}`);
        receiverFn(payloadObj);
    }
};

const _msgHandler = (packet) => {
    // TODO cleaner logic to listen on specific topics
    if (packet.topic.startsWith("telemetry")) {
        _addDevice(packet.topic);
        _notifyRegisteredReceiver(packet.topic, packet.payload.toString("utf8"));
    } else {
        logger.trace("Received random packet", packet.payload.toString("utf8"));
    }
};

const _connectionHandler = () => {
    logger.trace("A client has connected");
};

const _disconnectionHandler = () => {
    logger.trace("A client has disconnected");
};

const setupMQTTBroker = (mqttPort) => {
    // setup MQTT broker and bind handlers
    broker = _createMQTTBroker(mqttPort);
    broker.on("published", _msgHandler);
    broker.on("clientConnected", _connectionHandler);
    broker.on("clientDisconnected", _disconnectionHandler);
};

const getDevices = () => {
    const deviceList = [];
    devices.forEach((value, key) => {
        deviceList.push({
            deviceName: key,
            topic: value,
        });
    });
    return deviceList;
};

const registerReceiver = (topic, receiverFn) => {
    logger.info(`Registering receiver for topic ${topic} ...`);
    // we are *deliberately* flushing this map so we process only one device events at a time
    receivers.clear();
    receivers.set(topic, receiverFn);
};

module.exports = {
    setupMQTTBroker,
    getDevices,
    registerReceiver,
};
