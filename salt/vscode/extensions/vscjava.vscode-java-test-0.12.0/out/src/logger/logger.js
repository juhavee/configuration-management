"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const winston = require("winston");
const configs_1 = require("../constants/configs");
const outputChannelTransport_1 = require("./outputChannelTransport");
class Logger {
    initialize(storagePath) {
        this.storagePath = storagePath;
        this.logger = winston.createLogger({
            transports: [
                new (winston.transports.File)({
                    level: configs_1.LOG_FILE_LEVEL,
                    filename: path.join(this.storagePath, configs_1.LOG_FILE_NAME),
                    maxsize: configs_1.LOG_FILE_MAX_SIZE,
                    maxFiles: configs_1.LOG_FILE_MAX_NUMBER,
                    tailable: true,
                }),
                outputChannelTransport_1.outputChannelTransport,
            ],
        });
    }
    dispose() {
        for (const transport of this.logger.transports) {
            if (transport.close) {
                transport.close();
            }
        }
    }
    info(message) {
        this.logger.info(message);
    }
    error(message, error) {
        this.logger.error(`${message}.${error ? ' ' + error : ''}`);
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map