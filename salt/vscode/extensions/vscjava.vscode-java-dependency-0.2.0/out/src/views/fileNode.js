"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const commands_1 = require("../commands");
const dataNode_1 = require("./dataNode");
class FileNode extends dataNode_1.DataNode {
    constructor(nodeData, parent) {
        super(nodeData, parent);
    }
    hasChildren() {
        return false;
    }
    loadData() {
        return null;
    }
    createChildNodeList() {
        return null;
    }
    get iconPath() {
        return vscode_1.ThemeIcon.File;
    }
    get command() {
        return {
            title: "Open file",
            command: commands_1.Commands.VIEW_PACKAGE_OPEN_FILE,
            arguments: [this.uri],
        };
    }
}
exports.FileNode = FileNode;
//# sourceMappingURL=fileNode.js.map