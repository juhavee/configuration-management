"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const protocols_1 = require("../protocols");
function constructSearchTestItemParams(node) {
    if (node) {
        return {
            uri: vscode_1.Uri.file(node.fsPath).toString(),
            level: node.level,
            fullName: node.fullName,
        };
    }
    return {
        uri: '',
        level: protocols_1.TestLevel.Root,
        fullName: '',
    };
}
exports.constructSearchTestItemParams = constructSearchTestItemParams;
//# sourceMappingURL=protocolUtils.js.map