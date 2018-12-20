"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const kill = require("tree-kill");
function killProcess(process) {
    return new Promise((resolve) => {
        if (process && !process.killed) {
            kill(process.pid, 'SIGTERM', () => {
                return resolve();
            });
        }
        resolve();
    });
}
exports.killProcess = killProcess;
//# sourceMappingURL=cpUtils.js.map