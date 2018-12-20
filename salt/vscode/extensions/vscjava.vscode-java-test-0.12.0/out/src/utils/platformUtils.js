"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
function isDarwin() {
    return process.platform === 'darwin';
}
exports.isDarwin = isDarwin;
function isLinux() {
    return process.platform === 'linux';
}
exports.isLinux = isLinux;
//# sourceMappingURL=platformUtils.js.map