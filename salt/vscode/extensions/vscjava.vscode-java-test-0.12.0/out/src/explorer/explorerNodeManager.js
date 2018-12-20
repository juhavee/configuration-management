"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const protocols_1 = require("../protocols");
class ExplorerNodeManager {
    constructor() {
        this.explorerNodeMap = new Map();
    }
    getNode(fsPath) {
        return this.explorerNodeMap.get(fsPath);
    }
    storeNodes(...nodes) {
        for (const node of nodes) {
            if (node.level === protocols_1.TestLevel.Class) {
                this.explorerNodeMap.set(node.fsPath, node);
            }
        }
    }
    removeNode(fsPath) {
        this.explorerNodeMap.delete(fsPath);
    }
    dispose() {
        this.explorerNodeMap.clear();
    }
}
exports.explorerNodeManager = new ExplorerNodeManager();
//# sourceMappingURL=explorerNodeManager.js.map