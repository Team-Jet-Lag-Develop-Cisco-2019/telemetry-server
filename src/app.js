const logger = require("./utils/logger");
const broker = require("./broker");
const websocket = require("./websocket");

const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT || 1883;
const WS_SERVER_PORT = process.env.WS_SERVER_PORT || 9999;

logger.info("**** STARTUP ****");

// start websocket server
logger.info(`Starting WebSocket server on port ${WS_SERVER_PORT} ...`);
websocket.setupWebSocketServer(WS_SERVER_PORT);

// start MQTT broker
logger.info(`Starting MQTT broker on port ${MQTT_BROKER_PORT} ...`);
broker.setupMQTTBroker(MQTT_BROKER_PORT);

// start http server (for static UI)
