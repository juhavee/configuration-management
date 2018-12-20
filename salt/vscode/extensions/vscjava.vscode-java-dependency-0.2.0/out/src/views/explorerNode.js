"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class ExplorerNode {
    constructor(_parent) {
        this._parent = _parent;
    }
    static resolveIconPath(fileName) {
        return {
            light: services_1.Services.context.asAbsolutePath(`./images/light/${fileName}.svg`),
            dark: services_1.Services.context.asAbsolutePath(`./images/dark/${fileName}.svg`),
        };
    }
    getParent() {
        return this._parent;
    }
    get command() {
        return undefined;
    }
}
exports.ExplorerNode = ExplorerNode;
//# sourceMappingURL=explorerNode.js.map