const winston = require('winston');

// Create a logger instance with desired transports
const logger = winston.createLogger({
    level: 'info', // Log only messages with severity 'info' and above
    format: winston.format.combine(
        winston.format.colorize(), // Add color
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
        new winston.transports.File({ filename: 'app.log' }) // Log to a file named 'app.log'
    ]
});

module.exports = logger;