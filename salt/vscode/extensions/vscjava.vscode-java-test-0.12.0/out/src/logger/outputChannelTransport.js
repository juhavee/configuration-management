"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Transport = require("winston-transport");
class OutputChannelTransport extends Transport {
    constructor(options) {
        super(options);
        this.channel = vscode_1.window.createOutputChannel('Java Test Runner');
    }
    log(msg, next) {
        this.channel.append(msg.message);
        if (next) {
            next();
        }
    }
    close() {
        this.channel.dispose();
    }
    show() {
        this.channel.show();
    }
}
exports.outputChannelTransport = new OutputChannelTransport({ level: 'info' });
//# sourceMappingURL=outputChannelTransport.js.map