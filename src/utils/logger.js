const bunyan = require("bunyan");

const logLevel = process.env.LOG_LEVEL || "debug";

const bunyanOpts = {
    name: "telemetry-server",
    streams: [
        {
            level: logLevel,
            stream: process.stdout,
        },
    ],
};

module.exports = bunyan.createLogger(bunyanOpts);
