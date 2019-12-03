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

// if LOG_FILE env is defined, log to the file path
// as defined by LOG_FILE env
if (process.env.LOG_FILE) {
    bunyanOpts.streams.push({
        level: logLevel,
        stream: process.env.LOG_FILE,
    });
}

module.exports = bunyan.createLogger(bunyanOpts);
