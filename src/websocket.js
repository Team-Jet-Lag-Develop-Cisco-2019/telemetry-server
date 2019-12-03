const ws = require("ws");
const logger = require("./utils/logger");
const broker = require("./broker");

let server;
let connection;

const _handleMessage = (msg) => {
    if (msg === "LIST_DEVICES") {
        logger.info("Sending list of connected devices ...");
        connection.send(JSON.stringify({
            type: msg,
            msg: broker.getDevices(),
        }));
        return;
    }

    if (msg.startsWith("START ")) {
        const topic = msg.split(" ")[1];
        logger.info(`Starting telemetry events for topic ${topic} ...`);
        broker.registerReceiver(topic, (payload) => connection.send(JSON.stringify({
            type: "TELEMETRY",
            msg: payload,
        })));
        return;
    }

    logger.error(`Unknown message ${msg} received. Ignoring.`);
};

const _connectionHandler = (websocket) => {
    connection = websocket;
    connection.on("message", (message) => {
        logger.info(`Received message: ${message}`);
        _handleMessage(message);
    });
};

const setupWebSocketServer = (port) => {
    server = new ws.Server({ port });
    logger.info(`Websocket server READY on port ${port}`);
    server.on("connection", _connectionHandler);
};

const close = () => {
    logger.info("Closing websocket server ...");
    server.close();
};

module.exports = {
    setupWebSocketServer,
    close,
};
