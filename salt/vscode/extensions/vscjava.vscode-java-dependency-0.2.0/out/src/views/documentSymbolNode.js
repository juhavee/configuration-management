"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const baseSymbolNode_1 = require("./baseSymbolNode");
class DocumentSymbolNode extends baseSymbolNode_1.BaseSymbolNode {
    constructor(symbolInfo, parent) {
        super(symbolInfo, parent);
    }
    getChildren() {
        const res = [];
        if (this.symbolInfo && this.symbolInfo.children && this.symbolInfo.children.length) {
            this.symbolInfo.children.forEach((child) => {
                res.push(new DocumentSymbolNode(child, this.getParent()));
            });
        }
        return res;
    }
    getTreeItem() {
        if (this.symbolInfo) {
            const item = new vscode_1.TreeItem(this.symbolInfo.name, (this.symbolInfo.children && this.symbolInfo.children.length)
                ? vscode_1.TreeItemCollapsibleState.Collapsed : vscode_1.TreeItemCollapsibleState.None);
            item.iconPath = this.iconPath;
            item.command = this.command;
            return item;
        }
    }
    get range() {
        return this.symbolInfo.range;
    }
}
exports.DocumentSymbolNode = DocumentSymbolNode;
//# sourceMappingURL=documentSymbolNode.js.map